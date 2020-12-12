import { Participant, Pair } from 'interfaces'
import takeRandomMemberOfArray from './takeRandomMemberOfArray'

export default function makeRandomPairs(users: Array<Participant>): Array<Pair> {
	let pairs: Array<Pair> = []
	let tempArray: Array<Participant> = users.slice() // To not modify array given in arguments

	users.map((santa: Participant): void => {
		// To aboid case where user is being pair for himself
		const tempWithoutCurrentUser: Array<Participant> = tempArray.filter(
			(tempUser: Participant): boolean => santa !== tempUser
		)
		const recipient: Participant = takeRandomMemberOfArray(tempWithoutCurrentUser)
		const pair: Pair = { santa: santa, recipient: recipient }

		pairs.push(pair)

		// To avoid case where user gets more then one Secret Santa
		tempArray = tempArray.filter(
			(tempUser: Participant): boolean => tempUser !== recipient
		)
	})

	// If at least one of the users has got no pair, function runs again
	if (pairs.find((pair: Pair) => !pair.santa || !pair.recipient))
		pairs = makeRandomPairs(users)

	return pairs
}
