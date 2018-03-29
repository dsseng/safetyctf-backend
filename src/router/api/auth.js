import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'

const router = Router()

router.post('/login', ctx => {
  ctx.body = { token: jwt.sign({}, jwtConfig.secret, jwtConfig.options) }
})

export default router
