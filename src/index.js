import Koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-body'
import router from './router'
import dotenv from 'dotenv'

dotenv.config()

const app = new Koa()

app.use(helmet())
app.use(cors())
app.use(bodyParser())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.PORT)
