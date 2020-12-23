import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
		text: `Ты и так уже состоишь в комнате "${room.name}" (${room.code}). Может быть, ты хотел её покинуть?`,
		buttons: Markup.keyboard([
			[
				Markup.button({
					color: 'negative',
					action: {
						type: 'text',
						label: 'Покинуть комнату',
						payload: JSON.stringify({ command: 'leaveRoom' }),
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
		]),
	}
}
