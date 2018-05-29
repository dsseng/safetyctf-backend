import Router from 'koa-router'
import User from '../../../models/User'
import jwtConfig from '../../../config/jwt'
import jwt from 'jsonwebtoken'
import 'babel-polyfill'

const router = Router()

router.post('/sub', async ctx => {
  if (!ctx.request.body.jwt) {
    ctx.body = { code: 400, err: err }
    return
  }

  try {
    let decoded = jwt.verify(ctx.request.body.jwt, jwtConfig.secret)

    try {
      let foundUser = await User.findOne({ username: decoded.username })

      foundUser.pushToken = ctx.request.body.token
      await foundUser.save()

      ctx.body = { code: 200 }
    } catch (err) {
      console.error(err)
      ctx.body = { code: 500, err: err }
      return
    }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 401, err: err }
    return
  }
})


export default router
