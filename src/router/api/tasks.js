import Router from 'koa-router'
import Task from '../../../models/Task'
import jwt from 'jsonwebtoken'
import jwtConfig from '../../../config/jwt'

const router = Router()

router.get('/', async ctx => {
  try {
    ctx.body = { tasks: await Task.find(), code: 200 }
  } catch (err) {
    console.error(err)
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
      added: Date(),
      money: ctx.request.body.money,
      experience: ctx.request.body.experience,
      by: payload.username,
      id: ctx.request.body.id,
      url: ctx.request.body.url
    })

    await newTask.save()

    ctx.body = { task: newTask, code: 201 }
  } catch (err) {
    if (err.name && err.name === 'TokenExpiredError') {
      ctx.body = { code: 401, err: err }
      return
    }

    console.error(err)
    ctx.body = { code: 500, err: err }
  }
})

router.get('/:id', async ctx => {

  try {
    let foundTask = await Task.findOne({ id: ctx.params.id })

    if (!foundTask) {
      ctx.body = { code: 404 }
      return
    }

    ctx.body = { task: foundTask, code: 200 }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, err: err }
  }
})
router.patch('/:id', async ctx => {
  if (!ctx.request.body.token || !ctx.request.body.name || !ctx.request.body.flag || !ctx.request.body.money || !ctx.request.body.experience || !ctx.request.body.url) {
    ctx.body = { code: 400 }
    return
  }

  try {
    let payload = jwt.verify(ctx.request.body.token, jwtConfig.secret)

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
    foundTask.added = Date(),
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

    console.error(err)
    ctx.body = { code: 500, err: err }
  }
})

export default router
