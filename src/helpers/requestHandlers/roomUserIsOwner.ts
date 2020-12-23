import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomUserIsOwner(room: Room): MessageResponse {
	return {
		text: `Прости, но мы не можем убрать тебя из комнаты "${room.name}" (${room.code}), потому что ты её и создал.
Может быть ты захочешь удалить комнату?`,
		buttons: [
			[
				Markup.button({
					color: 'negative',
					action: {
						type: 'text',
						label: 'Удалить комнату',
						payload: JSON.stringify({ command: 'deleteRoom' }),
					},
				}),
			],
			[
				Markup.button({
					color: 'secondary',
					action: {
						type: 'text',
						label: 'Вернуться назад',
						payload: JSON.stringify({ command: 'start' }),
					},
				}),
			],
		],
	}
}
