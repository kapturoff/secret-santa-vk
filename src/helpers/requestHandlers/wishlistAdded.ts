import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function wishlistAdded(added: Boolean): MessageResponse {
	return {
		text: `${
			added
				? 'Йо-хо-хо, теперь твой Санта увидит твой список желаний!'
				: 'Ничего страшного, пусть твой Санта догадается что тебе дарить самостоятельно.'
		}
Нажми кнопку ниже для возвращения в меню.`,
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
