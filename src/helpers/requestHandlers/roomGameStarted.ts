import { ClientInfo, MessageResponse, Room, Participant } from 'interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

export default function roomNewParticipant(receiver: Participant, room: Room): MessageResponse {
	return {
		text: `Игра в комнате "${room.name}" (${room.code}) началась! 
Человек, которому ты должен подарить подарок: ${receiver.first_name} ${
			receiver.last_name
		} (vk.com/id${receiver.id}).
${
	receiver.wishlist
		? `\nВот что он${receiver.sex === 1 ? 'а' : ''} написал${
				receiver.sex === 1 ? 'а' : ''
		  } в своём списке желаний: \n${receiver.wishlist}`
		: ''
}

Желаю вам всем хорошо провести время! 🎅
`,
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
