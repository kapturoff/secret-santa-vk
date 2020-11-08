import { User, Pair } from '../interfaces'

function takeRandomMemberOfArray<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)]
}

function makeRandomPairs(users: Array<User>): Array<Pair> {
	let pairs: Array<Pair> = []
	let tempArray: Array<User> = users.slice() // To not modify array given in arguments

	users.map((santa: User): void => {
		// To aboid case where user is being pair for himself
		const tempWithoutCurrentUser: Array<User> = tempArray.filter(
			(tempUser: User): boolean => santa !== tempUser
		)
		const recipient: User = takeRandomMemberOfArray(tempWithoutCurrentUser)
		const pair: Pair = { santa: santa, recipient: recipient }

		pairs.push(pair)

		// To avoid case where user gets more then one Secret Santa
		tempArray = tempArray.filter(
			(tempUser: User): boolean => tempUser !== recipient
		)
	})

	// If at least one of the users has got no pair, function runs again
	if (pairs.find((pair: Pair) => !pair.santa && !pair.recipient))
		pairs = makeRandomPairs(users)

	return pairs
}

export default makeRandomPairs