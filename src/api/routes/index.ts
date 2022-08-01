import { Router } from 'express'

import v1 from './v1'

const routes = Router()

routes.get('/__health', (req, res) => {
  res.send({ status: 'OK' }).end()
})

routes.use('/__jobly', v1)

export default routes
