import { Prisma } from '@prisma/client'
import fetch from 'cross-fetch'

import { JobType } from '../../jobs/types'
import { Remotive, REMOTIVE_PROVIDER } from '../schemas/Remotive'
import { cleanHtmlContent } from '../utils/cleanHtmlContent'
import { generateHash } from '../utils/generateHash'
import { generateSlug } from '../utils/generateSlug'
import { convertCompanyLogo, enhanceCompanyData } from '../utils/mappers'

const API_BASE_URL = 'https://remotive.com/api/remote-jobs'

type RemotiveRequestParams = {
  search?: string
  limit?: number
}
const fetchRemotiveJobs = async ({
  search,
  limit,
}: RemotiveRequestParams = {}): Promise<Remotive[]> => {
  const params = {
    search,
    limit,
  }

  const url = new URL(API_BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url)
  const result = await response.json()
  return result.jobs
}

const getJobKind = (kind: string): JobType => {
  const kinds = {
    full_time: 'full-time',
    part_time: 'part-time',
    contract: 'contract',
    internship: 'internship',
    freelance: 'freelance',
  }

  // @ts-ignore
  return kinds[kind] || 'other'
}

const parseToJob = (job: Remotive): Prisma.JobCreateInput => {
  const hash = generateHash()
  const slug = generateSlug(job.company_name, job.title, hash)

  return {
    jobId: String(job.id),
    hash: hash,
    url: slug,
    createdAt: new Date(job.publication_date),
    publishedAt: new Date(job.publication_date),
    title: job.title,
    description: cleanHtmlContent(job.description),
    location: job.candidate_required_location,
    tags: job.tags.map(tag => tag.toLowerCase()),
    kind: job.job_type && getJobKind(job.job_type),
    remote: true,
    applicationUrl: job.url,
    company: String(job.company_name),
    companyLogo: String(job.company_logo),
    companyLogoUrl: String(job.company_logo),
    provider: REMOTIVE_PROVIDER,
  }
}

const filterCategory = (job: Remotive) => {
  const categories_blacklist = [
    // 'All others',
    // 'DevOps / Sysadmin',
    // 'Product',
    // 'Software Development',
    // 'Design',
    // 'Customer Service',
    // 'QA',
    // 'Data',
    'Finance / Legal',
    'Business',
    'Human Resources',
    'Sales',
    'Writing',
    'Marketing',
  ]

  return !categories_blacklist.includes(job.category)
}

export const getJobsFromRemotive = async (
  params?: RemotiveRequestParams
): Promise<Prisma.JobCreateInput[]> => {
  const pipePromise = new Promise((resolve, reject) => {
    return (
      fetchRemotiveJobs(params)
        .then(result => result.filter(filterCategory).map(parseToJob))
        .then(async jobs => await Promise.all(jobs.map(convertCompanyLogo)))
        // .then(async (jobs) => await Promise.all(jobs.map(enhanceCompanyData)))
        .then(resolve)
        .catch(reject)
    )
  })

  return await pipePromise.then()
}
