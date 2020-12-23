import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
        text: `Хорошо, я удалил комнату "${room.name}" (#${room.code})`,
        buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться в меню',
					payload: JSON.stringify({ command: 'start' }),
				},
			}),
		]),
	}
}
