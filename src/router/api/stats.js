import Router from 'koa-router'
import Task from '../../../models/Task'
import User from '../../../models/User'
import 'babel-polyfill'

const router = Router()

router.get('/usersAndTasks', async ctx => {
  try {
    let usersCount = (await User.find({})).length
    let tasksCount = (await Task.find({})).length
    ctx.body = { usersCount: usersCount, tasksCount: tasksCount, code: 200 }
  } catch (err) {
    console.error(err)
    ctx.body = { code: 500, err: err }
    return
  }
})

export default router
