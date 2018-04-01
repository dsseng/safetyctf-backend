import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'
import User from '../../../models/User'
import 'babel-polyfill'

const router = Router()

router.post('/isRegistered', async ctx => {
  if (!ctx.request.body.username) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let foundUser = await User.findOne({ username: ctx.request.body.username })
    if (foundUser) {
      ctx.body = { registered: true, code: 200 }
    } else {
      ctx.body = { registered: false, code: 200 }
    }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, errData: err }
    return
  }
})
router.post('/isAdmin', async ctx => {
  if (!ctx.request.body.username && !ctx.request.body.token) {
    ctx.body = { code: 400 }
    return
  }

  if (ctx.request.body.username) {
    try {
      let foundUser = await User.findOne({ username: ctx.request.body.username })
      if (foundUser.role === 'admin') {
        ctx.body = { admin: true, code: 200 }
      } else {
        ctx.body = { admin: false, code: 200 }
      }
    } catch (err) {
      console.error(err)
      ctx.body = { code: 500, errData: err }
      return
    }
  } else {
    try {
      let decoded = jwt.verify(ctx.request.body.token, jwtConfig.secret)

      try {
        let foundUser = await User.findOne({ username: decoded.username })
        if (foundUser.role === 'admin') {
          ctx.body = { admin: true, code: 200 }
        } else {
          ctx.body = { admin: false, code: 200 }
        }
      } catch (err) {
        console.error(err)
        ctx.body = { code: 500, errData: err }
        return
      }
    } catch (err) {
      console.error(err)
      ctx.body = { code: 400, errData: err }
      return
    }
  }
})
router.get('/usersAndTasks', async ctx => {
  try {
    let usersCount = (await User.find({})).length
    // let tasksCount = (await Task.find({})).length
    ctx.body = { usersCount: usersCount, tasksCount: 0, code: 200 }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, errData: err }
    return
  }
})

export default router
