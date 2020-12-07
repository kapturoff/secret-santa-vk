import mongoose from 'mongoose'
import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserSchema } from '../src/helpers/mongooseSchemas/User'
import { RoomSchema } from '../src/helpers/mongooseSchemas/Room'
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

let connection

before((done) => {
	const mongod = new MongoMemoryServer()

	mongod.getUri().then((uri) => {
		connection = mongoose.createConnection(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		
		done()
	})
})

describe('User Model Test', async () => {
	it('creates an user', async () => {
		let UserModel = connection.model('User', UserSchema),
			savedUser = await new UserModel(userData).save()

		expect(savedUser).to.have.property('_id')
		expect(savedUser).to.have.property('first_name')
		expect(savedUser).to.have.property('last_name')
		expect(savedUser.id).to.not.be.undefined
		expect(savedUser).to.have.property('sex').that.within(0, 2)
	})
})

describe('Room Model Test', async () => {
	it('creates a room', async () => {
		const RoomModel = connection.model('Room', RoomSchema),
			savedRoom = await new RoomModel(roomData).save()

		expect(savedRoom).to.have.property('_id')
		expect(savedRoom).to.have.property('name')
		expect(savedRoom).to.have.property('code')
		expect(savedRoom).to.have.property('owner').that.is.not.undefined
		expect(savedRoom)
			.to.have.property('participants')
			.that.has.lengthOf.above(0)
	})
})
