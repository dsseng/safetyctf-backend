import Router from 'koa-router'
import Task from '../../../models/Task'
import User from '../../../models/User'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'
import dotenv from 'dotenv'
import FCM from 'fcm-node'

dotenv.config()

let fcm = new FCM(process.env.SERVER_KEY)

const router = Router()

router.get('/', async ctx => {
  try {
    ctx.body = { tasks: await Task.find(), code: 200 }
  } catch (err) {
    debug('GET /tasks')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

router.post('/', async ctx => {
  if (!ctx.request.body.token || !ctx.request.body.name || !ctx.request.body.flag || !ctx.request.body.money || !ctx.request.body.experience || !ctx.request.body.id || !ctx.request.body.url) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let payload = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    if (payload.role != 'admin') {
      ctx.body = { code: 401 }
      return
    }

    let foundTask = await Task.findOne({ id: ctx.request.body.id })

    if (foundTask) {
      ctx.body = { task: foundTask, code: 302 }
      return
    }

    let newTask = new Task({
      name: ctx.request.body.name,
      flag: ctx.request.body.flag,
      added: new Date().toISOString(),
      money: ctx.request.body.money,
      experience: ctx.request.body.experience,
      by: payload.username,
      id: ctx.request.body.id,
      url: ctx.request.body.url
    })

    await newTask.save()

    let allUsers = await User.find({})
    allUsers = allUsers.map(x => x.pushToken)

    for (let user of allUsers) {
      if (user) {
        fcm.send({
          to: user,
          notification: {
            title: 'New task available!',
            body: 'You can solve ' + ctx.request.body.name + ' now!'
          }
        }, (err, response) => {
          if (err) {
            debug('POST /tasks')('Error:', err)
          } else {
            console.log('Successfully sent with response: ', response)
          }
        })
      }
    }

    ctx.body = { task: newTask, code: 201 }
  } catch (err) {
    if (err.name && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    debug('POST /tasks')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

router.get('/:id', async ctx => {
  try {
    const foundTask = await Task.findOne({ id: ctx.params.id })

    if (!foundTask) {
      ctx.body = { code: 404 }
      return
    }

    ctx.body = { task: foundTask, code: 200 }
  } catch (err) {
    debug('GET /tasks/:id')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

router.patch('/:id', async ctx => {
  if (!ctx.request.body.token) {
    ctx.body = { code: 400 }
    return
  }

  try {
    const payload = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    if (payload.role != 'admin') {
      ctx.body = { code: 401 }
      return
    }

    let foundTask = await Task.findOne({ id: ctx.params.id })

    if (!foundTask) {
      ctx.body = { code: 404 }
      return
    }

    foundTask.name = ctx.request.body.name
    foundTask.flag = ctx.request.body.flag,
    foundTask.added = new Date().toISOString(),
    foundTask.money = ctx.request.body.money,
    foundTask.experience = ctx.request.body.experience,
    foundTask.url = ctx.request.body.url

    await foundTask.save()

    ctx.body = { task: foundTask, code: 200 }
  } catch (err) {
    if (err.name && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    debug('PATCH /tasks/:id')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

router.post('/:id/solved', async ctx => {
  if (!ctx.request.body.token || !ctx.request.body.flag) {
    ctx.body = { code: 400 }
    return
  }

  try {
    const payload = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    let foundTask = await Task.findOne({ id: ctx.params.id })

    if (!foundTask) {
      ctx.body = { code: 404 }
      return
    }

    let foundUser = await User.findOne({ username: payload.username })

    if (!foundUser) {
      ctx.body = { code: 404 }
      return
    }

    if (!await foundTask.comparePassword(ctx.request.body.flag)) {
      ctx.body = { code: 418 }
      return
    }

    if (foundUser.tasksSolved.find(x => x === ctx.params.id)) {
      ctx.body = { code: 415 }
      return
    }

    foundTask.solvedBy.push(payload.username)

    await foundTask.save()

    foundUser.money += foundTask.money
    foundUser.experience += foundTask.experience
    foundUser.tasksSolved.push(ctx.params.id)

    await foundUser.save()

    ctx.body = { code: 200 }
  } catch (err) {
    if (err.name && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    debug('/tasks/:id/solved')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

router.post('/:id/isSolved', async ctx => {
  if (!ctx.request.body.token) {
    ctx.body = { code: 400 }
    return
  }

  try {
    const payload = jwt.verify(ctx.request.body.token, jwtConfig.secret)

    const foundUser = await User.findOne({ username: payload.username })

    if (!foundUser) {
      ctx.body = { code: 404 }
      return
    }

    if (foundUser.tasksSolved.find(x => x === ctx.params.id)) {
      ctx.body = { code: 200, solved: true }
      return
    } else {
      ctx.body = { code: 200, solved: false }
      return
    }
  } catch (err) {
    if (err.name && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    debug('/tasks/:id/isSolved')('Error:', err)
    ctx.body = { code: 500, err: err }
  }
})

export default router
