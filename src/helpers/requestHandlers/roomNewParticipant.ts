import { ClientInfo, MessageResponse, Room, Participant } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomNewParticipant(
	user: Participant,
	room: Room
): MessageResponse {
	return {
		text: `${user.first_name} ${user.last_name} ${
			user.sex === 1 ? 'присоединилась' : 'присоединился'
		} к комнате ${room.name} (${room.code})`,
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
