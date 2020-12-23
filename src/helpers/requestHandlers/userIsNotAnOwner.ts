import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(): MessageResponse {
	return {
		text: `Прости, но удалить комнату может только её создатель`,
		buttons: [
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться назад',
					payload: JSON.stringify({ command: 'start' }),
				},
			}),
		],
	}
}
