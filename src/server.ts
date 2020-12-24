import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import bot from './bot/bot'

const app = new Koa()
const router = new Router()

router.post('/', bot.webhookCallback)

app.use(bodyParser())
app.use(router.routes())

app.listen(process.env.PORT)
