import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomChooseNameHandler(): MessageResponse {
	return {
		text: `Как ты назовёшь свою комнату? 🤔`,
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
