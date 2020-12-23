import Scene from 'node-vk-bot-api/lib/scene'
import RequestHandlers from '../requestHandlers/requestHandlers'
import DatabaseAdapter from '../DatabaseAdapter/DatabaseAdapter'
import { Room } from 'interfaces'
import { Document } from 'mongoose'

const requestHandlers = new RequestHandlers(),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string)

export default new Scene(
	'leaveRoom',
	async (ctx: any) => {
		const { text, buttons } = requestHandlers.userLeavingRoom()
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

		const roomLeaved = await databaseAdapter.deleteUserFromRoom(ctx.session.userData, code)

		if (roomLeaved === 3) {
			const roomFound = await databaseAdapter.getRoom(code)
			if (roomFound) {
				const { text, buttons } = requestHandlers.userLeavedRoom(
					roomFound as Room & Document
				)
				ctx.reply(text, null, buttons)
			}
		} else if (roomLeaved === 2) {
            const roomFound = await databaseAdapter.getRoom(code)
			if (roomFound) {
				const { text, buttons } = requestHandlers.roomUserIsOwner(
					roomFound as Room & Document
				)
				ctx.reply(text, null, buttons)
			}
        } else if (roomLeaved === 1) {
            const roomFound = await databaseAdapter.getRoom(code)
			if (roomFound) {
				const { text, buttons } = requestHandlers.roomLeaveFailure(
					roomFound as Room & Document
				)
				ctx.reply(text, null, buttons)
			}
        } else {
            const { text, buttons } = requestHandlers.roomNotFound(code)
			ctx.reply(text, null, buttons)
        }

		ctx.scene.leave()
	},
)
