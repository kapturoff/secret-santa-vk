import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinHandler(): MessageResponse {
	return {
		text: `Чтобы присоединиться к уже созданной комнате тебе нужно отправить код, полученный тобой от друга`,
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
	} as MessageResponse
}