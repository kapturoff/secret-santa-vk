import { expect } from 'chai'
import makeRandomPairs from '../src/helpers/makeRandomPairs'

describe('makeRandomPairs() function', () => {
	const users = [
		{ name: 'Donald Duck', id: 0 },
		{ name: 'Roberto', id: 1 },
		{ name: 'Foo', id: 2 },
		{ name: 'Bar', id: 3 },
		{ name: 'Vobla', id: 4 },
		{ name: 'John', id: 5 },
	]
	
	const pairs = makeRandomPairs(users)

	it('must return count of pairs that equals count of users', () => {
		expect(pairs).have.lengthOf(users.length)
	})

	it('every pair must contain Santa and Recipient', () => {
		for (const pair of pairs) {
			expect(pair).to.have.property('santa').that.is.not.an('undefined')
			expect(pair)
				.to.have.property('recipient')
				.that.is.not.an('undefined')
		}
	})
})
