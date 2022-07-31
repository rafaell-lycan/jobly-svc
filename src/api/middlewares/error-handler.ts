import { ErrorRequestHandler } from 'express'

import logger from '../../utils/logger'
// import { WebError } from '../../utils/errors'

interface WebError extends Error {
  status?: number
}

const errorHandler: ErrorRequestHandler = (err: WebError, req, res, next) => {
  logger.error(err)
  const message = err.message || 'Something went wrong. Please try again.'
  const status = err.status || 500

  res.status(status).json({ message, status }).end()
}

export default errorHandler
