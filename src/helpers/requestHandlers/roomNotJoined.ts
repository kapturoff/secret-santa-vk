import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'vk-markup'

export default function roomNotJoinedHandler(code: string): MessageResponse {
	return {
		text: `Прости, но я не смог найти комнату c кодом ${code}. Возможно, ты ошибся с кодом?`,
		buttons: [
			Markup.button({
				color: 'secondary',
				action: {
					label: 'Вернуться назад',
					payload: { action: 'start' },
				},
			}),
		],
	}
}
