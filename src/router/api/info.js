import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'
import User from '../../../models/User'
import Task from '../../../models/Task'
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
      ctx.body = { code: 500, err: err }
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
        ctx.body = { code: 500, err: err }
        return
      }
    } catch (err) {
      console.error(err)
      ctx.body = { code: 400, err: err }
      return
    }
  }
})
router.get('/:username/info', async ctx => {
  try {
    let user = await User.findOne({ username: ctx.params.username })

    let tasks = await Promise.all(user.tasksSolved.map(async t => await Task.findOne({ id: t })))

    ctx.body = { user: user, tasksSolved: tasks, code: 200 }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, err: err }
    return
  }
})
router.post('/getUsername', async ctx => {
  if (!ctx.request.body.token) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let decoded = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    ctx.body = { username: decoded.username, code: 200 }
  } catch (err) {
    ctx.body = { code: 401, err: err }
    return
  }
})

export default router
