import Router from 'koa-router'
import Task from '../../../models/Task'
import User from '../../../models/User'
import 'babel-polyfill'

const router = Router()

router.get('/usersAndTasks', async ctx => {
  try {
    const usersCount = (await User.find({})).length
    const tasksCount = (await Task.find({})).length
    ctx.body = { usersCount: usersCount, tasksCount: tasksCount, code: 200 }
  } catch (err) {
    debug('/stats/usersAndTasks')('Error:', err)
    ctx.body = { code: 500, err: err }
    return
  }
})

router.get('/leaderboard', async ctx => {
  try {
    let users = (await User.find({}))
    let i, j

    for (i = 0; i < users.length; i++) { // Sort users by experience
      let value = users[i]
      // store the current item value so it can be placed right
      for (j = i - 1; j > -1 && users[j].experience < value.experience; j--) {
        // loop through the items in the sorted array (the items from the current to the beginning)
        // copy each item to the next one
        users[j + 1] = users[j]
      }
      // the last item we've reached should now hold the value of the currently sorted item
      users[j + 1] = value
    }

    ctx.body = { users: users, code: 200 }
  } catch (err) {
    debug('/stats/leaderboard')('Error:', err)
    ctx.body = { code: 500, err: err }
    return
  }
})

export default router
