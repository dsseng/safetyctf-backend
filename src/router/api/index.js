import Router from 'koa-router'
import auth from './auth'

const router = Router()

router.get('/', ctx => {
  ctx.body = 'Hello, API!'
})
router.use('/auth', auth.routes(), auth.allowedMethods())

export default router
