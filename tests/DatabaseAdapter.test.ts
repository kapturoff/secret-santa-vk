import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import DatabaseAdapter, {
	IDatabaseAdapter,
} from '../src/helpers/DatabaseAdapter/DatabaseAdapter'
import { User, Room } from '../src/interfaces'

const userData1: User = {
		first_name: 'John',
		last_name: 'Doe',
		id: 2384723482,
		sex: 2,
	},
	userData2: User = {
		first_name: 'NotJohn',
		last_name: 'NotDoe',
		id: 2354356534,
		sex: 1,
	},
	roomData: Room = {
		name: 'Christmas Room',
		code: '02x1234j',
		participants: [userData1],
		owner: userData1,
	}

let databaseAdapter: IDatabaseAdapter

describe('DatabaseAdapter Class Test', async () => {
	before((done) => {
		const mongod = new MongoMemoryServer()
		mongod.getUri().then((uri) => {
			databaseAdapter = new DatabaseAdapter(uri)
			done()
		})
	})

	describe('createRoom() Function Test', () => {
		it('room can be created', async () => {
			const room = await databaseAdapter.createRoom(roomData.name, roomData.code, userData1)
	
			expect(room).to.not.be.undefined
		})
	})

	describe('addUserToRoom() Function Test', () => {
		it('user can access existing room', async () => {
			const userJoinedRoom = await databaseAdapter.addUserToRoom(
				userData2,
				roomData.code
			)

			expect(userJoinedRoom).to.be.equal(2)
		})

		it('user can not join a room if he is already joined', async () => {
			const userJoinedRoom = await databaseAdapter.addUserToRoom(
				userData1,
				roomData.code
			)

			expect(userJoinedRoom).to.be.equal(1)
		})

		it('user can not join a room that does not exist', async () => {
			const userJoinedRoom = await databaseAdapter.addUserToRoom(
				userData1,
				'code that does not exist'
			)

			expect(userJoinedRoom).to.be.equal(0)
		})
	})

	describe('deleteUserFromRoom() Function Test', () => {
		it('user can not leave a room that does not exist', async () => {
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(
				userData1,
				'code of room that does not exist'
			)

			expect(userLeavedRoom).to.be.equal(0)
		})

		it('user can leave the room', async () => {
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(
				userData1,
				roomData.code
			)

			expect(userLeavedRoom).to.be.equal(2)
		})

		it('user can not leave the room if he is not in it', async () => {
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(
				userData1,
				roomData.code
			)

			expect(userLeavedRoom).to.be.equal(1)
		})
	})

	after((done) => {
		databaseAdapter.connection.close().then(() => done())
	})
})
