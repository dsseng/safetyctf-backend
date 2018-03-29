import Router from 'koa-router'
import api from './api'

const router = Router()

router.get('/', ctx => {
  ctx.body = 'Hello, World!'
})
router.use('/api', api.routes(), api.allowedMethods())

export default router
