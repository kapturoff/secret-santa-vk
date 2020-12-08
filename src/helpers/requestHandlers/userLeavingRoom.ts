import { ClientInfo, MessageResponse } from 'interfaces'

export default function userLeavingRoom(): MessageResponse {
	return {
		text: `Отправь код комнаты, которую ты хочешь покинуть:`,
	}
}