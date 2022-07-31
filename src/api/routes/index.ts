import { Router } from 'express'

const routes = Router()

routes.get('/__health', (req, res) => {
  res.send({ status: 'OK' }).end()
})

export default routes
