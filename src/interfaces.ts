export type Participant = {
	first_name: string
	last_name: string
	id: number
	sex: 0 | 1 | 2
	wishlist: string
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
	buttons?: {
		color: 'positive' | 'negative' | 'secondary' | 'primary'
		action: {
			label: string
			payload: object
			type?: 'text'
		}
	}[]
}

export type Room = {
	code: string
	name: string
	participants: Participant[]
	owner: Participant
}
