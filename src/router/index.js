import Router from 'koa-router'

const router = Router()

router.get('/', (ctx, next) => {
  ctx.body = 'Hello, World!'
})

export default router
