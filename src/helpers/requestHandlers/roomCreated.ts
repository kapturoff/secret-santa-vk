import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomCreatedHandler(clientInfo: ClientInfo, room: Room): MessageResponse {
	return {
		text: `Поздравляю, ты только что создал комнату для проведения "Тайного Санты" 👀

Вот название комнаты: "${room.name}", а вот её код: ${room.code}

Чтобы к ней присоединились твои друзья, они должны запустить бота, нажать на кнопку "Присоединиться к комнате", а затем отправить в диалог с ботом следующий код: ${room.code}

А всё, что теперь требуется от тебя — разослать друзьям код от этой комнаты, а затем, когда все соберутся, начать розыгрыш, нажав на кнопку под этим сообщением или отправив в беседу с ботом эту команду: /startRoom:${room.code}

Ну а в следующем сообщении ты можешь отправить список своих пожеланий для подарков 😅 

Этот список увидит только твой личный Тайный Санта. Если ты не хочешь его заполнять или хочешь, чтобы твой Тайный Санта придумал что тебе дарить самостоятельно — не беда: ты можешь пропустить этот этап и оставить поле полностью пустым, написав мне "Пропустить".

Подумай хорошенько, ведь другой возможности добавить список пожеланий у тебя не будет 😭`,
		buttons: Markup.keyboard([
			Markup.button({
				color: 'primary',
				action: {
					type: 'text',
					label: 'Начать!',
					payload: JSON.stringify({ command: 'startRoom:' + room.code }),
				},
			}),
		]).inline(),
	} as MessageResponse
}
