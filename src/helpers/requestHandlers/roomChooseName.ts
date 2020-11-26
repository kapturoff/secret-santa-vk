import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'vk-markup'

export default function roomChooseNameHandler(): MessageResponse {
	return {
		text: `Как ты назовёшь свою комнату?`,
	} as MessageResponse
}
