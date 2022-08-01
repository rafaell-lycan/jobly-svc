import { Router } from 'express'
import asyncHandler from 'express-async-handler'

import { getJobs } from '../../../domain/providers'

const routes = Router()

const PROCESS_TYPE = {
  IMPORT: 'IMPORT',
}

routes.get(
  '/service/cron',
  asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers
    const { process_type: processType } = req.query

    if (!authorization || !processType) {
      next()
    } else {
      if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
        res
          .status(401)
          .json({ message: 'Access token is missing or invalid' })
          .end()
      }

      if (!Object.values(PROCESS_TYPE).includes(processType as string)) {
        res
          .status(400)
          .json({ message: `Invalid process: ${processType}` })
          .end()
      } else {
        const jobs = await getJobs()
        // Put on queue
        console.log(`Fetched ${jobs.length} jobs`)

        res.send({ success: true }).end()
      }
    }
  })
)

export default routes
