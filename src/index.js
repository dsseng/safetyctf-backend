import Koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import debug from 'debug'
import router from './router'

dotenv.config()

mongoose.connect(process.env.DBURL)
const db = mongoose.connection
db.on('error', err => debug('mongodb')('MongoDB error:', err))
db.once('open', () => debug('mongodb')('connected to MongoDB'))

const app = new Koa()

app.context.db = mongoose
app.use(helmet())
app.use(cors())
app.use(bodyParser())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.PORT, () => debug('http')('backend API is listening on port ' + process.env.PORT))
