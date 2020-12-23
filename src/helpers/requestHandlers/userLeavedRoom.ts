import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
		text: `Хорошо, ты покинул комнату "${room.name}" (${room.code}) 😁`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться назад',
					payload: JSON.stringify({ command: 'start' })
				},
			}),
		]),
	}
}