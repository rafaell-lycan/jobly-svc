import { Prisma } from '@prisma/client'
import fetch from 'cross-fetch'

import { RemoteOk, REMOTEOK_PROVIDER } from '../schemas/RemoteOk'
import { convertMarkdownToHtml } from '../utils/convertMarkdownToHtml'
import { generateHash } from '../utils/generateHash'
import { generateSlug } from '../utils/generateSlug'
import { convertCompanyLogo, enhanceCompanyData } from '../utils/mappers'

const API_BASE_URL = 'https://remoteok.com/api'

type RemoteOkRequestParams = {
  tag?: string
}
const fetchRemoteOkJobs = async ({ tag }: RemoteOkRequestParams = {}): Promise<
  RemoteOk[]
> => {
  const params = { tag }

  const url = new URL(API_BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url)
  const result = (await response.json()) as RemoteOk[]

  return result.filter(item => item?.id)
}

const parseToJob = (job: RemoteOk): Prisma.JobCreateInput => {
  const hash = generateHash()
  const slug = generateSlug(job.company, job.position, hash)

  return {
    // description: cleanHtmlContent(job.description),
    jobId: String(job.id),
    hash: hash,
    url: slug,
    createdAt: new Date(job.date),
    publishedAt: new Date(job.date),
    title: job.position,
    description: convertMarkdownToHtml(job.description),
    location: job.location,
    tags: job.tags.map(tag => tag.toLowerCase()),
    remote: true,
    applicationUrl: job.apply_url,
    company: String(job.company),
    companyLogo: String(job.company_logo),
    companyLogoUrl: String(job.company_logo),
    provider: REMOTEOK_PROVIDER,
  }
}

export const getJobsFromRemoteOk = async (
  params?: RemoteOkRequestParams
): Promise<Prisma.JobCreateInput[]> => {
  const pipePromise = new Promise((resolve, reject) => {
    return (
      fetchRemoteOkJobs(params)
        .then(result => result.map(parseToJob))
        .then(async jobs => await Promise.all(jobs.map(convertCompanyLogo)))
        // .then(async (jobs) => await Promise.all(jobs.map(enhanceCompanyData)))
        .then(resolve)
        .catch(reject)
    )
  })

  return await pipePromise.then()
}
