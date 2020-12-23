import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(): MessageResponse {
	return {
		text: `Прости, но я не понял что ты написал 🤔 
Попробуй нажать на одну из кнопок на клавиатуре.`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться назад',
					payload: JSON.stringify({ command: 'start' }),
				},
			}),
		]),
	}
}
