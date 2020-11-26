import { ClientInfo, MessageResponse, Room, User } from 'interfaces'
import Markup from 'vk-markup'

export default function roomNewParticipant(
	user: User,
	room: Room
): MessageResponse {
	return {
		text: `${user.first_name} ${user.last_name} ${
			user.sex === 1 ? 'присоединилась' : 'присоединился'
		} к комнате ${room.name} (${room.code})`,
	}
}
