import Koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import router from './router'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.DBURL)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => console.log('Connected to MongoDB!'))

const app = new Koa()

app.context.db = mongoose
app.use(helmet())
app.use(cors())
app.use(bodyParser())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.PORT)
