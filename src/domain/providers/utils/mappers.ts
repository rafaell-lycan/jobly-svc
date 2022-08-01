import { Prisma } from '@prisma/client'

import { getCompanyData } from './getCompanyData'
import { getImageBase64 } from './getImageBase64'

export const enhanceCompanyData = async (
  job: Prisma.JobCreateInput
): Promise<Prisma.JobCreateInput> => {
  if (!job.company) return job

  const result = await getCompanyData(job.company)

  if (!result) return job

  return {
    ...job,
    companyLogo: result.logo,
    companyLogoUrl: result.logo,
  }
}

export const convertCompanyLogo = async (
  job: Prisma.JobCreateInput
): Promise<Prisma.JobCreateInput> => {
  if (!job?.companyLogoUrl) return job

  const base64Img = await getImageBase64(job.companyLogoUrl)

  return {
    ...job,
    companyLogo: base64Img,
  }
}
