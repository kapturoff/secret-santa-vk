import Scene from 'node-vk-bot-api/lib/scene'
import RequestHandlers from '../requestHandlers/requestHandlers'
import DatabaseAdapter from '../DatabaseAdapter/DatabaseAdapter'
import { Room } from 'interfaces'
import { Document } from 'mongoose'

const requestHandlers = new RequestHandlers(),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string)

export default new Scene(
	'joinRoom',
	async (ctx: any) => {
		const { text, buttons } = requestHandlers.roomJoin()
		ctx.scene.next()
		ctx.reply(text, null, buttons)
	},
	async (ctx: any) => {
		if ((ctx.message.text as string).toLowerCase() === 'вернуться назад') {
			const { text, buttons } = requestHandlers.greeter(ctx.session.userData.rooms)
			ctx.reply(text, null, buttons)
			ctx.scene.leave()
			return
		}

		const code: string = ctx.message.text
		ctx.session.roomCode = code

		const roomJoined = await databaseAdapter.addUserToRoom(ctx.session.userData, code)

		if (roomJoined === 2) {
			const roomFound = (await databaseAdapter.getRoom(code)) as Room & Document
			if (roomFound) {
				const { text, buttons } = requestHandlers.roomJoined(roomFound)
				ctx.reply(text, null, buttons)

				const broadcast = requestHandlers.roomNewParticipant(
					ctx.session.userData,
					roomFound
                )
                
				roomFound.participants
					.filter((participant) => participant.id !== ctx.session.userData.id)
					.map((participant) => {
						ctx.bot.sendMessage(participant.id, broadcast.text, null, broadcast.buttons)
					})
			}
		} else if (roomJoined === 1) {
			const roomFound = await databaseAdapter.getRoom(code)
			if (roomFound) {
				const { text, buttons } = requestHandlers.roomJoinFailure(
					roomFound as Room & Document
				)
				ctx.reply(text, null, buttons)
			}
			ctx.scene.leave()
		} else {
			const { text, buttons } = requestHandlers.roomNotFound(code)
			ctx.reply(text, null, buttons)
		}

		ctx.scene.next()
	},
	async (ctx: any) => {
		const text = (ctx.message.text as string).toLowerCase()
		
		if (text === 'пропустить' || text === "вернуться назад" || text === "начать!")  {
			const { text, buttons } = requestHandlers.wishlistAdded(false)
			ctx.scene.leave()
			ctx.reply(text, null, buttons)
		} else {
			await databaseAdapter.addWishlist(
				ctx.session.userData,
				ctx.session.roomCode,
				ctx.message.text
            )
            
            const { text, buttons } = requestHandlers.wishlistAdded(true)
			ctx.scene.leave()
			ctx.reply(text, null, buttons)
		}
	}
)
