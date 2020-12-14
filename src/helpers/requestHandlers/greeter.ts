import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function greeterHandler(joinedRooms: Room[]): MessageResponse {
	return {
		text: `О-хо-хо, привет! 🎅
Я — бот, позволяющий провести игру "Тайный Санта" не выходя из ВК.

${
	joinedRooms.length
		? 'Вот список комнат, в которых вы уже участвуете:\n' +
		  joinedRooms.map((room: Room) => `- ${room.name} (${room.code})`).join('\n')
		: 'Вы ещё не присоединились ни к одной комнате и это пора исправить!'
}

Чтобы создать, покинуть или подключиться к комнате для игры, нажми на одну из кнопок ниже.`,
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
				color: 'secondary',
				action: {
					label: 'Выйти из комнаты',
					payload: { action: 'leaveRoom' },
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
