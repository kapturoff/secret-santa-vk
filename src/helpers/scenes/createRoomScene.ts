import Scene from 'node-vk-bot-api/lib/scene'
import RequestHandlers from '../requestHandlers/requestHandlers'
import DatabaseAdapter from '../DatabaseAdapter/DatabaseAdapter'
import createID from '../createID/createID'
import { Room } from 'interfaces'

const requestHandlers = new RequestHandlers(),
	databaseAdapter = new DatabaseAdapter(process.env.DATABASE_URL as string)

export default new Scene(
	'createRoom',
	(ctx: any) => {
		const { text, buttons } = requestHandlers.roomChooseName()
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
		
		const code = createID()
		ctx.session.roomCode = code

		const roomCreated = await databaseAdapter.createRoom(
			ctx.message.text,
			code,
			ctx.session.userData
		)

		const { text, buttons } = requestHandlers.roomCreated(
			ctx.client_info,
			(roomCreated as unknown) as Room
		)

		ctx.scene.next()
		ctx.reply(text, null, buttons)
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
