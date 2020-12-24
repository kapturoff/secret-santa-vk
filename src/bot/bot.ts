import VKBot from 'node-vk-bot-api'
import Session from 'node-vk-bot-api/lib/session'
import Stage from 'node-vk-bot-api/lib/stage'
import winston from 'winston'
import { Document } from 'mongoose'
import { User, Room } from 'interfaces'
import Queue from '../helpers/queue/Queue'
import RequestHelpers from '../helpers/requestHandlers/requestHandlers'
import DatabaseAdapter from '../helpers/DatabaseAdapter/DatabaseAdapter'
import GetUserVK from '../helpers/getUserVK/getUserVK'
import CreateRoomScene from '../helpers/scenes/createRoomScene'
import LeaveRoomScene from '../helpers/scenes/leaveRoomScene'
import JoinRoomScene from '../helpers/scenes/joinRoomScene'
import DeleteRoomScene from '../helpers/scenes/deleteRoomScene'

const bot = new VKBot({
		token: process.env.TOKEN as string,
		confirmation: process.env.CONFIRMATION as string,
	}),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string),
	requestHandlers = new RequestHelpers(),
	getUserVK = GetUserVK(bot),
	session = new Session(),
	scenes = new Stage(CreateRoomScene, LeaveRoomScene, JoinRoomScene, DeleteRoomScene),
	queue = new Queue(600),
	logger = winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		defaultMeta: {
			service: 'bot-service',
		},
		transports: [
			new winston.transports.File({
				filename: './bot-service.log',
				level: 'info',
			}),
		],
	})

bot.use(session.middleware())
bot.use(scenes.middleware())

bot.use(async (ctx: any, next: () => void) => {
	try {
		await next()
	} catch (e) {
		logger.error(`Error`, { usr_id: ctx.message.id, ...e })
		const { text, buttons } = requestHandlers.error()
		ctx.reply(text, null, buttons)
	}
})

bot.on(async (ctx: any) => {
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
				room = ((await databaseAdapter.getRoom(code)) as unknown) as Room,
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
					const { text, buttons } = requestHandlers.roomGameStarted(pair.recipient, room)

					queue.addToQueue(() => {
						bot.sendMessage(pair.santa.id, text, null, buttons).catch((e: any) => null)
					})
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
})

export default bot
