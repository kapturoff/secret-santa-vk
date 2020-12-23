import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomNotJoinedHandler(code: string): MessageResponse {
	return {
		text: `Прости, но я не смог найти комнату c кодом "${code}" 😅 
Возможно, ты ошибся с кодом?`,
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
