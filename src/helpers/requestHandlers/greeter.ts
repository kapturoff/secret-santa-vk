import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'vk-markup'

export default function greeterHandler(joinedRooms?: Room[]): MessageResponse {
	return {
		text: `О-хо-хо, привет! 🎅
Я — бот, позволяющий провести игру "Тайный Санта" не выходя из ВК.
${
	joinedRooms
		? '\nВот список комнат, в которых вы уже участвуете:\n' +
		  joinedRooms
				.map((room: Room) => `- ${room.name} (${room.code})`)
				.join('\n') +
		  '\n'
		: ''
}
Чтобы создать комнату или присоединиться к ней, нажми на одну из кнопок ниже.`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'positive',
				action: {
					label: 'Создать комнату',
					payload: { action: 'createRoom' },
				},
			}),
			Markup.button({
				color: 'secondary',
				action: {
					label: 'Присоединиться к комнате',
					payload: { action: 'joinRoom' },
				},
			}),
			Markup.button({
				color: 'negative',
				action: {
					label: 'Что такое "Тайный Санта"?',
					payload: { action: 'help' },
				},
			}),
		]),
	} as MessageResponse
}
