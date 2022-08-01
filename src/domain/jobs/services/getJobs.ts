import { Job } from '@prisma/client'

import { prisma } from '../../../lib/prisma'

const JOBS_PER_PAGE = 20

export type APIMetadata = {
  count: number // amount of jobs
  total: number // amount of pages
  isFirstPage?: boolean
  isLastPage?: boolean
  perPage?: number // default: 20
}

export type JobsWithMetadata = {
  items: Job[]
  meta: APIMetadata
}

type Params = {
  offset: number
  limit: number
  noLimit: boolean
}

export const getJobs = async ({
  offset = 0,
  limit = JOBS_PER_PAGE,
  noLimit = false,
}): Promise<JobsWithMetadata> => {
  const [count, items] = await prisma.$transaction([
    prisma.job.count({
      where: {
        NOT: {
          publishedAt: undefined,
        },
      },
    }),
    prisma.job.findMany({
      where: {
        NOT: {
          publishedAt: undefined,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      ...(noLimit ? {} : { take: limit, skip: offset * limit }),
    }),
  ])

  return {
    items: JSON.parse(JSON.stringify(items)),
    meta: {
      count: count,
      total: Math.ceil(count / limit),
    },
  }
}
