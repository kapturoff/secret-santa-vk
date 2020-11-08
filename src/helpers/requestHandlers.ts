import { ClientInfo, MessageResponse, Room } from '../interfaces'
import Markup from 'node-vk-bot-api/lib/markup'

function greeterHandler(joinedRooms?: Room[]): MessageResponse {
	return {
		text: `О-хо-хо, привет! 🎅
Я — бот, позволяющий провести игру "Тайный Санта" не выходя из ВК.
${
	joinedRooms
		? '\nВот список комнат, в которых вы уже участвуете:\n' +
		  joinedRooms
				.map((room: Room) => `- ${room.name} (${room.code})`)
				.join('\n') +
		  '\n'
		: ''
}
Чтобы создать комнату или присоединиться к ней, нажми на одну из кнопок ниже.`,
		buttons: [
			Markup.button({
				color: 'positive',
				action: {
					label: 'Создать комнату',
					payload: { action: 'createRoom' },
				},
			}),
			Markup.button({
				color: 'secondary',
				action: {
					label: 'Присоединиться к комнате',
					payload: { action: 'joinRoom' },
				},
			}),
			Markup.button({
				color: 'negative',
				action: {
					label: 'Что такое "Тайный Санта"?',
					payload: { action: 'help' },
				},
			}),
		],
	} as MessageResponse
}

function roomChooseNameHandler(): MessageResponse {
	return {
		text: `Как ты назовёшь свою комнату?`,
	} as MessageResponse
}

function createdRoomHandler(
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
	} as MessageResponse
}

function joinRoomHandler(): MessageResponse {
	return {
		text: `Чтобы присоединиться к уже созданной комнате, отправь боту код, полученный тобой от друга`,
	} as MessageResponse
}

function joinedRoomHandler(room: Room): MessageResponse {
	return {
		text: `Отлично, я добавил тебя в комнату "${room.name} #${room.code}"!

В следующем сообщении ты можешь отправить список своих пожеланий для подарков. 
Этот список увидит только твой личный Тайный Санта. Если ты не хочешь его заполнять, или хочешь, чтобы твой Тайный Санта придумал что тебе дарить самостоятельно — не беда: ты можешь пропустить этот этап и оставить поле полностью пустым, нажав кнопку "Пропустить"`,
		buttons: [
			Markup.button({
				color: 'secondary',
				action: {
					label: 'Пропустить',
					payload: { action: 'start' },
				},
			}),
		],
	}
}

function failedToJoinRoomHandler(code: string): MessageResponse {
	return {
		text: `Сожалею, но я не смог найти комнату под кодом ${code}. Возможно, ты ошибся с кодом?`,
		buttons: [
			Markup.button({
				color: 'secondary',
				action: {
					label: 'Вернуться назад',
					payload: { action: 'start' },
				},
			}),
		],
	}
}

function helpHandler(): MessageResponse {
	return {
		text: `Тайный Санта — игра, позволяющая весело провести любой праздник, связанный с подарками.

Каждое Рождество, Новый Год, а так же в кучу других тематических праздниках люди обмениваются подарками. Чтобы сделать этот процесс ещё более интересным, можно случайным образом объединить людей в пары — Тайный Санта и получатель подарков. Каждый человек в этой игре будет иметь обе из этих двух ролей одновременно — он будет и кому-то что-то дарить, и что-то от кого-то получать.

Разница от простого обмена подарками лишь в том, что в Тайном Санте ты не будешь знать не только то, что тебе подарят, но и то, кто тебе будет что-либо дарить.        
И это безумно интересно ^-^
        `,
	}
}

export {
	greeterHandler,
	roomChooseNameHandler,
	createdRoomHandler,
	joinRoomHandler,
	joinedRoomHandler,
	failedToJoinRoomHandler,
	helpHandler,
}
