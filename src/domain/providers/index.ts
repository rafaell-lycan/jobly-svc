import logger from '../../utils/logger'
import { getJobsFromRemoteOk } from './services/getJobsFromRemoteOk'
import { getJobsFromRemotive } from './services/getJobsFromRemotive'

const REMOTIVE_RESULT_LIMIT = process.env.REMOTIVE_RESULT_LIMIT
  ? parseInt(process.env.REMOTIVE_RESULT_LIMIT)
  : undefined

export const getJobs = async (): Promise<any> => {
  try {
    const result = await Promise.all([
      getJobsFromRemoteOk(),
      REMOTIVE_RESULT_LIMIT
        ? getJobsFromRemotive({ limit: REMOTIVE_RESULT_LIMIT })
        : getJobsFromRemotive(),
    ])
    const jobs = result.flat()

    return jobs
  } catch (error) {
    logger.error(error)
    throw error
  }
}
