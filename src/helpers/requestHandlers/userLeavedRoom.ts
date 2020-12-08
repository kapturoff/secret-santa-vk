import { ClientInfo, MessageResponse, Room } from 'interfaces'

export default function roomJoinedHandler(room: Room): MessageResponse {
	return {
        text: `Хорошо, ты покинул комнату "${room.name}" (${room.code})!`
	}
}