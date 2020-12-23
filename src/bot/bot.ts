import VKBot from 'node-vk-bot-api'
import Session from 'node-vk-bot-api/lib/session'
import Stage from 'node-vk-bot-api/lib/stage'
import { Document } from 'mongoose'
import { User, Room, MessageResponse } from 'interfaces'
import RequestHelpers from '../helpers/requestHandlers/requestHandlers'
import DatabaseAdapter from '../helpers/DatabaseAdapter/DatabaseAdapter'
import GetUserVK from '../helpers/getUserVK/getUserVK'
import CreateRoomScene from '../helpers/scenes/createRoomScene'
import LeaveRoomScene from '../helpers/scenes/leaveRoomScene'
import JoinRoomScene from '../helpers/scenes/joinRoomScene'
import DeleteRoomScene from '../helpers/scenes/deleteRoomScene'

const bot = new VKBot(process.env.TOKEN as string),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string),
	requestHandlers = new RequestHelpers(),
	getUserVK = GetUserVK(bot),
	session = new Session(),
	scenes = new Stage(CreateRoomScene, LeaveRoomScene, JoinRoomScene, DeleteRoomScene)

bot.use(session.middleware())
bot.use(scenes.middleware())

bot.on(async (ctx: any) => {
	try {
		const { payload, text } = ctx.message,
			userVkData = ((await getUserVK(ctx.message.from_id)) as unknown) as User[],
			user = (await databaseAdapter.saveUser(userVkData[0] as User)) as User & Document,
			routeRaw = /\{"command":"(.*)"\}/.exec(payload),
			route = routeRaw ? routeRaw[1] : 'error'

		if (text === '/start' || text === 'Начать' || route === 'start') {
			const { text, buttons } = requestHandlers.greeter(user.rooms)
			ctx.reply(text, null, buttons)
		} else if (route === 'createRoom') {
			ctx.session.userData = user
			ctx.scene.enter('createRoom')
		} else if (route === 'leaveRoom') {
			ctx.session.userData = user
			ctx.scene.enter('leaveRoom')
		} else if (route === 'joinRoom') {
			ctx.session.userData = user
			ctx.scene.enter('joinRoom')
		} else if (route === 'deleteRoom') {
			ctx.session.userData = user
			ctx.scene.enter('deleteRoom')
		} else if (route === 'help') {
			const { text, buttons } = requestHandlers.help()
			ctx.reply(text, null, buttons)
		} else if (text.startsWith('/startRoom') || route.startsWith('startRoom')) {
			const codeRaw = /:(.+)/.exec(route === 'error' ? text : route)

			if (codeRaw) {
				const code = codeRaw[1],
					gameStarted = await databaseAdapter.startGame(user, code)

				if (gameStarted.status === 0) {
					const { text, buttons } = requestHandlers.roomNotFound(code)
					ctx.reply(text, null, buttons)
				} else if (gameStarted.status === 1) {
					const { text, buttons } = requestHandlers.userIsNotAnOwner()
					ctx.reply(text, null, buttons)
				} else if (gameStarted.status === 2) {
					const { text, buttons } = requestHandlers.roomNotEnoughParticipants(
						((await databaseAdapter.getRoom(code)) as unknown) as Room
					)
					ctx.reply(text, null, buttons)
				} else if (gameStarted.status === 3) {
					gameStarted.pairs.map(async (pair) => {
						const { text, buttons } = requestHandlers.roomGameStarted(
							pair.recipient,
							((await databaseAdapter.getRoom(code)) as unknown) as Room
						)
						bot.sendMessage(pair.santa.id, text, null, buttons)
					})
				} else {
					const { text, buttons } = requestHandlers.error()
					ctx.reply(text, null, buttons)
				}
			} else {
				const { text, buttons } = requestHandlers.unknownCommand()
				ctx.reply(text, null, buttons)
			}
		} else {
			const { text, buttons } = requestHandlers.unknownCommand()
			ctx.reply(text, null, buttons)
		}
	} catch (e) {
		console.error(e)
		const { text, buttons } = requestHandlers.error()
		ctx.reply(text, null, buttons)
	}
})

bot.startPolling((err: any) => {
	if (err) console.error(err)
	console.log(`I'm alive!`)
})

export default bot
