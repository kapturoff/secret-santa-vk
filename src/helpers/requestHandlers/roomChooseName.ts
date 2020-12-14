import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomChooseNameHandler(): MessageResponse {
	return {
		text: `Как ты назовёшь свою комнату?`,
	} as MessageResponse
}
