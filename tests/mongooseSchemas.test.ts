import mongoose from 'mongoose'
import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserModel } from '../src/helpers/mongooseSchemas/User'
import { RoomModel } from '../src/helpers/mongooseSchemas/Room'
import { User, Room } from '../src/interfaces'

const userData: User = {
		first_name: 'John',
		last_name: 'Doe',
		id: 2384723482,
		sex: 2,
	},
	roomData: Room = {
		name: 'Christmas Room',
		code: '02x1234j',
		participants: [userData],
		owner: userData,
	}

before(async () => {
	const mongod = new MongoMemoryServer({
		instance: {
			dbName: 'santa-claus',
		},
	})

	const uri = await mongod.getUri()

	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
})

describe('User Model Test', () => {
	it('creates an user', async () => {
		const savedUser = await new UserModel(userData).save()

		expect(savedUser).to.have.property('_id')

		expect(savedUser).to.have.property('first_name')
		expect(savedUser).to.have.property('last_name')

		expect(savedUser.id)

		expect(savedUser).to.have.property('sex').that.within(0, 2)
	})
})

describe('Room Model Test', () => {
	it('creates a room', async () => {
		const savedRoom = await new RoomModel(roomData).save()

		expect(savedRoom).to.have.property('_id')

		expect(savedRoom).to.have.property('name')
		expect(savedRoom).to.have.property('code')

		expect(savedRoom).to.have.property('owner').that.is.not.undefined

		expect(savedRoom)
			.to.have.property('participants')
			.that.has.lengthOf.above(0)
	})
})

after(() => {
	mongoose.connection.close()
	setTimeout(() => process.exit(0), 2000)
})
