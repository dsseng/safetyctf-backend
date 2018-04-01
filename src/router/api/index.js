import Router from 'koa-router'
import auth from './auth'
import info from './info'

const router = Router()

router.get('/', ctx => {
  ctx.body = 'Hello, API!'
})
router.use('/auth', auth.routes(), auth.allowedMethods())
router.use('/info', info.routes(), info.allowedMethods())

export default router
