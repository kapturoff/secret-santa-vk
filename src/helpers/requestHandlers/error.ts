import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function helpHandler(): MessageResponse {
	return {
        text: `Произошла какая-то ошибка, которую мой создатель не предусмотрел. Не расстраивайтесь, он скоро всё починит.
Не хотите вернуться в меню?`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Вернуться в меню',
					payload: JSON.stringify({ command: 'start' })
				},
			}),
		]),
	}
}