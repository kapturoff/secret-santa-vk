export type User = {
	first_name: string
	last_name: string
	id: number
	sex: 0 | 1 | 2
}

export type Pair = {
	santa: User
	recipient: User
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
	participants: User[]
	owner: User
}
