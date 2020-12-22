import VKBot from 'node-vk-bot-api'
import Session from 'node-vk-bot-api/lib/session'
import Stage from 'node-vk-bot-api/lib/stage'
import { Document } from 'mongoose'
import { User, Room, MessageResponse } from 'interfaces'
import RequestHelpers from '../helpers/requestHandlers/requestHandlers'
import DatabaseAdapter from '../helpers/DatabaseAdapter/DatabaseAdapter'
import GetUserVK from '../helpers/getUserVK/getUserVK'
import CreateRoomScene from '../helpers/scenes/createRoomScene'

const bot = new VKBot(process.env.TOKEN as string),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string),
	requestHandlers = new RequestHelpers(),
	getUserVK = GetUserVK(bot),
	session = new Session(),
	createRoomStage = new Stage(CreateRoomScene)

bot.use(session.middleware())
bot.use(createRoomStage.middleware())

bot.on(async (ctx: any) => {
	const { payload, text } = ctx.message
	const userVkData = ((await getUserVK(ctx.message.from_id)) as unknown) as User[]
	const user = (await databaseAdapter.saveUser(userVkData[0] as User)) as User & Document

	if (text === '/start' || payload === '{"command":"start"}') {
		const { text, buttons } = requestHandlers.greeter(user.rooms)
		ctx.reply(text, null, buttons)
	}

	if (payload === '{"command":"createRoom"}') {
		ctx.session.userData = user
		ctx.scene.enter('createRoom')
	}
})

bot.startPolling((err: any) => {
	if (err) console.error(err)
	console.log(`I'm alive!`)
})

export default bot
