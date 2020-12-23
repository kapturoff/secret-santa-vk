import { ClientInfo, MessageResponse } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function userDeletingRoom(): MessageResponse {
	return {
		text: `Отправь код комнаты, которую ты хочешь удалить`,
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