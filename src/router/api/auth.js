import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'
import User from '../../../models/User'
import 'babel-polyfill'

const router = Router()

router.post('/register', async ctx => {
  if (!ctx.request.body.name || !ctx.request.body.surname || !ctx.request.body.dob || !ctx.request.body.username || !ctx.request.body.password) {
    ctx.body = { code: 400 }
    return
  }

  let newUser = new User({
    name: ctx.request.body.name,
    surname: ctx.request.body.surname,
    dob: ctx.request.body.dob,
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    registerDate: Date()
  })

  try {
    ctx.body = { user: await newUser.save(), code: 200 }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, err: err }
    return
  }
})

router.post('/login', async ctx => {
  if (!ctx.request.body.username || !ctx.request.body.password) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let user = await User.findOne({ username: ctx.request.body.username })

    if (!user) {
      ctx.body = { code: 404 }
      return
    }

    if (await user.comparePassword(ctx.request.body.password)) {
      ctx.body = { token: jwt.sign({
        username: user.username,
        name: user.name,
        surname: user.surname,
        dob: user.dob,
        role: user.role,
        tasksSolved: user.tasksSolved,
        money: user.money,
        experience: user.experience,
        registerDate: user.registerDate,
        friends: user.friends
      }, jwtConfig.secret, jwtConfig.options), code: 200 }
    } else {
      ctx.body = { code: 401 }
      return
    }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, err: err }
    return
  }
})

router.post('/refreshToken', ctx => {
  if (!ctx.request.body.token) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let decoded = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    ctx.body = { token: jwt.sign({
      username: decoded.username,
      name: decoded.name,
      surname: decoded.surname,
      dob: decoded.dob,
      role: decoded.role,
      tasksSolved: decoded.tasksSolved,
      money: decoded.money,
      experience: decoded.experience,
      registerDate: decoded.registerDate,
      friends: decoded.friends
    }, jwtConfig.secret, jwtConfig.options), code: 200 }
  } catch (err) {
    ctx.body = { code: 401, err: err }
    return
  }
})

router.post('/changePassword', async ctx => {
  if (!ctx.request.body.token || !ctx.request.body.oldPassword || !ctx.request.body.newPassword) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let decoded = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    let user = await User.findOne({ username: decoded.username })
    if (!user) {
      ctx.body = { code: 404 }
      return
    }

    if (!await user.comparePassword(ctx.request.body.oldPassword)) {
      ctx.body = { code: 401 }
      return
    }

    user.password = ctx.request.body.newPassword
    await user.save()

    ctx.body = { user: user, code: 200 }
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    console.error(err)
    ctx.body = { code: 500, err: err }
    return
  }
})

router.get('/:username/info', async ctx => {
  try {
    ctx.body = { user: await User.findOne({ username: ctx.params.username }), code: 200 }
  } catch (err) {
    ctx.body = { code: 500, err: err }
    return
  }
})

export default router
