import Scene from 'node-vk-bot-api/lib/scene'
import RequestHandlers from '../requestHandlers/requestHandlers'
import DatabaseAdapter from '../DatabaseAdapter/DatabaseAdapter'
import { Room } from 'interfaces'
import { Document } from 'mongoose'

const requestHandlers = new RequestHandlers(),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string)

export default new Scene(
	'deleteRoom',
	async (ctx: any) => {
		const { text, buttons } = requestHandlers.userDeletingRoom()
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

		const roomDeleted = await databaseAdapter.deleteRoom(ctx.session.userData, code)

		if (roomDeleted === 2) {
			const roomFound = await databaseAdapter.getRoom(code)
			if (roomFound) {
				const { text, buttons } = requestHandlers.userDeletedRoom(
					roomFound as Room & Document
				)
				ctx.reply(text, null, buttons)
			}
		} else if (roomDeleted === 1) {
			const { text, buttons } = requestHandlers.userIsNotAnOwner()
			ctx.reply(text, null, buttons)
		} else {
			const { text, buttons } = requestHandlers.roomNotFound(code)
			ctx.reply(text, null, buttons)
		}

		ctx.scene.leave()
	}
)
