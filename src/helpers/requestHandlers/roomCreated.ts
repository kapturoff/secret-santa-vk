import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomCreatedHandler(
	clientInfo: ClientInfo,
	room: Room
): MessageResponse {
	return {
		text: `Поздравляю, ты создал комнату для проведения "Тайного Санты"!
Название комнаты: "${room.name}", её код: ${room.code}.

Чтобы к ней присоединились твои друзья, они должны запустить бота, нажать на кнопку "Присоединиться к комнате", а затем отправить в диалог с ботом следующий код: ${
			room.code
		}.
А всё, что теперь требуется от тебя — разослать друзьям код от этой комнаты, а затем, когда все соберутся, начать розыгрыш, ${
			clientInfo.inline_keyboard
				? 'нажав на кнопку под этим сообщением'
				: 'отправив в беседу с ботом команду /startRoom:' + room.code
		}`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'default',
				action: {
					label: 'Начать!',
					payload: { action: 'startRoom' },
				},
			}),
		]).inline(),
	} as MessageResponse
}
