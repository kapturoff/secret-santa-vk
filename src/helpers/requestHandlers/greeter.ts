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
					type: 'text',
					label: 'Создать комнату',
					payload: JSON.stringify({ command: 'createRoom' },)
				},
			}),
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Присоединиться к комнате',
					payload: JSON.stringify({ command: 'joinRoom' },)
				},
			}),
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Выйти из комнаты',
					payload: JSON.stringify({ command: 'leaveRoom' },)
				},
			}),
			Markup.button({
				color: 'negative',
				action: {
					type: 'text',
					label: 'Что такое "Тайный Санта"?',
					payload: JSON.stringify({ command: 'help' },)
				},
			}),
		]),
	} as MessageResponse
}
