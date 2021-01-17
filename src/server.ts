import express from 'express'
import bodyParser from 'body-parser'
import bot from './bot/bot'

const app = express(),
	PORT = process.env.PORT as unknown

app.use(bodyParser.json())
app.post('/', bot.webhookCallback)

app.listen(PORT as number, () => {
	console.log(`⚡️[server]: Server is running at ${PORT as number} port`)
})
