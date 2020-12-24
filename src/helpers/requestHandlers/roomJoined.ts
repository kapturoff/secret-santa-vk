import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
		text: `Отлично, я добавил тебя в комнату "${room.name}" (${room.code})!

В следующем сообщении ты можешь отправить список своих пожеланий для подарков. 

Этот список увидит только твой личный Тайный Санта. Если ты не хочешь его заполнять, или хочешь, чтобы твой Тайный Санта придумал что тебе дарить самостоятельно — не беда: ты можешь пропустить этот этап и оставить поле полностью пустым, нажав кнопку "Пропустить"`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Пропустить',
				},
			}),
		]),
	}
}
