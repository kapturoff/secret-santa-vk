import mongoose from 'mongoose'
import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ParticipantSchema } from '../src/helpers/mongooseSchemas/Participant'
import { RoomSchema } from '../src/helpers/mongooseSchemas/Room'
import { UserSchema } from '../src/helpers/mongooseSchemas/User'
import { Room, Participant, User } from '../src/interfaces'

const participantData: Participant = {
		first_name: 'John',
		last_name: 'Doe',
		id: 2384723482,
		sex: 2,
		wishlist: '',
	},
	roomData: Room = {
		name: 'Christmas Room',
		code: '02x1234j',
		participants: [participantData],
		owner: participantData,
	},
	userData: User = {
		first_name: 'John',
		last_name: 'Doe',
		id: 2384723482,
		rooms: [],
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
	it('creates a participant', async () => {
		let UserModel = connection.model('Participant', ParticipantSchema),
			savedUser = await new UserModel(participantData).save()

		expect(savedUser).to.have.property('_id')
		expect(savedUser).to.have.property('first_name')
		expect(savedUser).to.have.property('last_name')
		expect(savedUser.id).to.not.be.undefined
		expect(savedUser).to.have.property('sex').that.within(0, 2)
		expect(savedUser.wishlist).to.be.string
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
		expect(savedRoom).to.have.property('participants').that.has.lengthOf.above(0)
	})
})

describe('User Model Test', async () => {
	it('creates an user', async () => {
		let UserModel = connection.model('User', UserSchema, 'users'),
			savedUser = await new UserModel(userData).save()

		expect(savedUser).to.have.property('_id')
		expect(savedUser).to.have.property('first_name')
		expect(savedUser).to.have.property('last_name')
		expect(savedUser.id).to.be.a('number')
		expect(savedUser.rooms).to.be.a('array')
	})
})
