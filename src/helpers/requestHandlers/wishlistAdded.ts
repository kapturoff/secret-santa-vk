import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomNotJoinedHandler(): MessageResponse {
	return {
        text: `Йо-хо-хо, теперь твой Санта увидит твой список желаний! 
Нажми кнопку ниже для возвращения в меню.`,
		buttons: [
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться назад',
					payload: JSON.stringify({ command: 'start' })
				},
			}),
		],
	}
}
