/**
 * Participant model is abstractrion above a
 * participant of the room. It does not contain
 * any data about which rooms user joined, but contains
 * special field "wishlist", that are unique for 
 * every room too.
 */
export type Participant = {
	first_name: string
	last_name: string
	id: number
	sex: 0 | 1 | 2
	wishlist: string
}

/**
 * User model is abstraction above a real user.
 * It should only contain information about which
 * room an user joined into.
 */
export type User = {
	first_name: string
	last_name: string
	id: number
	sex: 0 | 1 | 2
	rooms: Room[]
}

export type Pair = {
	santa: Participant
	recipient: Participant
}

export type ClientInfo = {
	button_actions: string[]
	keyboard: boolean
	inline_keyboard: boolean
	carousel: boolean
	lang_id: number
}

export type MessageResponse = {
	text: string
	buttons: {
		color: 'positive' | 'negative' | 'secondary' | 'primary'
		action: {
			type: 'text'
			label: string
			payload: string
		}
	}[]
}

export type Room = {
	code: string
	name: string
	participants: Participant[]
	owner: User
}
