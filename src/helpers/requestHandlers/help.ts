import { ClientInfo, MessageResponse, Room } from 'interfaces'
import Markup from 'vk-markup'

export function helpHandler(): MessageResponse {
	return {
		text: `Тайный Санта — игра, позволяющая весело провести любой праздник, связанный с подарками.

Каждое Рождество, Новый Год, а так же в кучу других тематических праздниках люди обмениваются подарками. Чтобы сделать этот процесс ещё более интересным, можно случайным образом объединить людей в пары — Тайный Санта и получатель подарков. Каждый человек в этой игре будет иметь обе из этих двух ролей одновременно — он будет и кому-то что-то дарить, и что-то от кого-то получать.

Разница от простого обмена подарками лишь в том, что в Тайном Санте ты не будешь знать не только то, что тебе подарят, но и то, кто тебе будет что-либо дарить.        
И это безумно интересно ^-^
        `,
	}
}