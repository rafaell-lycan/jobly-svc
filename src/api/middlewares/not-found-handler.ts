import { Handler } from 'express'

// import { NotFoundError } from '../../utils/errors'

const notFoundHandler: Handler = (req, res, next) => {
  next(new Error('No route matched with those values.'))
}

export default notFoundHandler
