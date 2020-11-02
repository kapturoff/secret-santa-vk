// Pick random member of array
const pickRandomFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)]

/**
 * @param {string[]} array - Array to make the pairs
*/
const makePairs = (array) => {
	let pairs = {} // Here will be pairs
	let temp = arr.slice() // Create a temporary array. I

	arr.map((user) => {
		// Get all of the members of array except current member and randomly pick an one of them.
		// It's necessary to remove current member, because it fixes case where one of the members is goint to be pair for itself
		let tempWithoutCurrentUser = temp.filter((tempUser) => tempUser !== user) 
		let pair = pickRandomFromArr(tempWithoutCurrentUser)

		// Set for user with current name his pair
		pairs[user] = pair

		// Remove member which has already got his pair from temporary array
		temp = temp.filter((user) => user !== pair)
    	})

	// If at least one of the members has got no pair, function runs again
	if (Object.keys(pairs).some(key => !pairs[key])) pairs = makePairs(arr)

	return pairs
}