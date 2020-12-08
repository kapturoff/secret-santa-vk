import { ClientInfo, MessageResponse, Room } from 'interfaces'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
        text: `Прости, но ты и так не состоишь в комнате "${room.name}" (${room.code})`
	}
}