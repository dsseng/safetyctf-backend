import Router from 'koa-router'
import auth from './auth'
import info from './info'
import tasks from './tasks'
import stats from './stats'
import push from './push'

const router = Router()

router.get('/', ctx => {
  ctx.body = 'Hello, API!'
})
router.use('/auth', auth.routes(), auth.allowedMethods())
router.use('/info', info.routes(), info.allowedMethods())
router.use('/tasks', tasks.routes(), tasks.allowedMethods())
router.use('/stats', stats.routes(), stats.allowedMethods())
router.use('/push', push.routes(), push.allowedMethods())

export default router
