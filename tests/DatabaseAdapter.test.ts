import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import DatabaseAdapter, { IDatabaseAdapter } from '../src/helpers/DatabaseAdapter/DatabaseAdapter'
import { User, Room } from '../src/interfaces'
import { Document } from 'mongoose'

const userData1: User = {
		first_name: 'John',
		last_name: 'Doe',
		id: 2384723482,
		sex: 2,
		rooms: [],
	},
	userData2: User = {
		first_name: 'NotJohn',
		last_name: 'NotDoe',
		id: 2354356534,
		sex: 1,
		rooms: [],
	},
	userData3: User = {
		first_name: 'Alexandra',
		last_name: 'Bob',
		id: 23543234285,
		sex: 0,
		rooms: [],
	},
	userData4: User = {
		first_name: 'Cheema',
		last_name: 'Meema',
		id: 23882992944,
		sex: 2,
		rooms: [],
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

	describe('saveUser() Function Test', () => {
		it('user can be saved', async () => {
			const user1Saved = await databaseAdapter.saveUser(userData1)
			const user2Saved = await databaseAdapter.saveUser(userData2)
			expect(user1Saved).to.not.be.undefined
			expect(user2Saved).to.not.be.undefined
		})

		it('user can not be saved again', async () => {
			const copyOfUser: User = { ...userData1, first_name: 'JohnCopy' }
			const userSaved = await databaseAdapter.saveUser(copyOfUser)
			expect(userSaved).to.have.property('first_name', 'John')
		})
	})

	describe('createRoom() Function Test', () => {
		it('room can be created', async () => {
			const room = await databaseAdapter.createRoom('Christmas Room', '02x1234j', userData1)

			expect(room).to.not.be.undefined
		})
	})

	describe('addUserToRoom() Function Test', () => {
		it('user can access existing room', async () => {
			const userJoinedRoom = await databaseAdapter.addUserToRoom(userData2, '02x1234j')

			expect(userJoinedRoom).to.be.equal(2)
		})

		it('user can not join a room if he is already joined', async () => {
			// User1 is already in the room, because he joined it by creating a room
			const userJoinedRoom = await databaseAdapter.addUserToRoom(userData1, '02x1234j')

			expect(userJoinedRoom).to.be.equal(1)
		})

		it('user can not join a room that does not exist', async () => {
			const userJoinedRoom = await databaseAdapter.addUserToRoom(
				userData1,
				'code that does not exist'
			)

			expect(userJoinedRoom).to.be.equal(0)
		})

		it('user can add wishlist if he wants', async () => {
			const wishlistAdded = await databaseAdapter.addWishlist(
				userData1,
				'02x1234j',
				'I want to get cake'
			)

			expect(wishlistAdded).to.exist
		})

		describe('getRoom() Function Test', () => {
			it('must return room', async () => {
				const user = await databaseAdapter.getRoom('02x1234j')
				expect(user).to.not.be.null
			})
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
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(userData2, '02x1234j')

			expect(userLeavedRoom).to.be.equal(3)
		})

		it('user can not leave the room if he is not in it', async () => {
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(userData2, '02x1234j')

			expect(userLeavedRoom).to.be.equal(1)
		})

		it('user can not leave the room if he is an owner', async () => {
			const userLeavedRoom = await databaseAdapter.deleteUserFromRoom(userData1, '02x1234j')

			expect(userLeavedRoom).to.be.equal(2)
		})
	})

	describe('isUserOwnerOfRoom() Function Test', () => {
		it('should be an owner', async () => {
			expect(await databaseAdapter.isUserOwnerOfRoom(userData1, '02x1234j')).to.be.true
		})

		it('should not be an owner', async () => {
			expect(await databaseAdapter.isUserOwnerOfRoom(userData2, '02x1234j')).to.be.false
		})
	})

	describe('deleteRoom() Function Test', () => {
		it('user can not delete room that does not exist', async () => {
			const roomDeleted = await databaseAdapter.deleteRoom(
				userData1,
				'code that does not exist'
			)
			expect(roomDeleted).to.be.equal(0)
		})

		it('user can not delete room if he is not its owner', async () => {
			const roomDeleted = await databaseAdapter.deleteRoom(userData2, '02x1234j')
			expect(roomDeleted).to.be.equal(1)
		})

		it('room must be deleted from "rooms" collection', async () => {
			const roomDeleted = await databaseAdapter.deleteRoom(userData1, '02x1234j')
			const roomFound = await databaseAdapter.getRoom('02x1234j')

			expect(roomDeleted).to.be.equal(2)
			expect(roomFound).to.be.null
		})

		it('room must not to be in "rooms" field of users', async () => {
			const user = (await databaseAdapter.getUser(userData1.id)) as unknown

			expect((user as User).rooms).to.not.satisfy((array: Room[]) =>
				array.some((room: Room) => room.code === '02x1234j')
			)
		})
	})

	describe('startGame() Function Test', async () => {
		it('game can not be started in room that does not exist', async () => {
			const roomCreated = (await databaseAdapter.createRoom(
				'Test',
				'88888888',
				userData1
			)) as Document & Room
			await databaseAdapter.addUserToRoom(userData2, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData3, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData4, roomCreated.code)

			const gameStarted = await databaseAdapter.startGame(userData1, 'code that does not exist')
			expect(gameStarted.status).to.be.equal(0)
		})

		it('game can not be started by not an owner', async () => {
			const roomCreated = (await databaseAdapter.createRoom(
				'Test',
				'1234',
				userData1
			)) as Document & Room
			await databaseAdapter.addUserToRoom(userData2, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData3, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData4, roomCreated.code)

			const gameStarted = await databaseAdapter.startGame(userData2, '1234')
			expect(gameStarted.status).to.be.equal(1)
		})

		it('game can not be started if count of participants less than 4', async () => {
			const roomCreated = (await databaseAdapter.createRoom(
				'Test',
				'191919',
				userData1
			)) as Document & Room
			await databaseAdapter.addUserToRoom(userData2, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData3, roomCreated.code)

			const gameStarted = await databaseAdapter.startGame(userData1, '191919')
			expect(gameStarted.status).to.be.equal(2)
		})

		it('room will be deleted after game started', async () => {
			const roomCreated = (await databaseAdapter.createRoom(
				'Test',
				'010101',
				userData1
			)) as Document & Room
			await databaseAdapter.addUserToRoom(userData2, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData3, roomCreated.code)
			await databaseAdapter.addUserToRoom(userData4, roomCreated.code)

			const gameStarted = await databaseAdapter.startGame(userData1, '010101')
			const room = await databaseAdapter.getRoom('010101')

			expect(gameStarted.status).to.be.equal(3)
			expect(room).to.be.null
		})
	})

	after((done) => {
		databaseAdapter.connection.close().then(() => done())
	})
})
