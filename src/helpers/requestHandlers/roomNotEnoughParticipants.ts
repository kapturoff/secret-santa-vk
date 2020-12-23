import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
        text: `Прости, ${room.owner.first_name + ' ' + room.owner.last_name}, но в комнате "${room.name}" (${room.code}) недостаточно участников 😭

На данный момент в комнате ${room.participants.length} участника(-ов), а для начала игры нужно минимум 4.
Позови ещё пару друзей. Чем их больше, тем интереснее играть!`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'secondary',
				action: {
					type: 'text',
					label: 'Пропустить',
					payload: JSON.stringify({ command: 'start' })
				},
			}),
		]),
	}
}
