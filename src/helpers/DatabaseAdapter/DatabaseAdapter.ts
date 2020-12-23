import mongoose from 'mongoose'
import { Participant, Room, User } from 'interfaces'
import { RoomSchema } from '../mongooseSchemas/Room'
import { ParticipantSchema } from '../mongooseSchemas/Participant'
import { UserSchema } from '../mongooseSchemas/User'

export interface IDatabaseAdapter {
	_convertUserIntoParticipant(user: User): Participant
	createRoom(name: string, code: string, owner: User): Promise<mongoose.Document>
	/**
	 * Returns:
	 * - 0 - if room was not found
	 * - 1 - if user was already in the room
	 * - 2 - if user joined the room
	 */
	addUserToRoom(user: User, code: string): Promise<0 | 1 | 2>
	/**
	 * Returns:
	 * - 0 - if room was not found
	 * - 1 - if user is not in the room
	 * - 2 - if user is owner and can not leave room
	 * - 3 - if user leaved a room
	 */
	deleteUserFromRoom(user: User, code: string): Promise<0 | 1 | 2 | 3>
	addWishlist(user: User, code: string, wishlist: string): Promise<mongoose.Document | null>
	saveUser(user: User): Promise<mongoose.Document>
	saveRoomInUserProfile(user: User, code: string): Promise<mongoose.Document | null>
	/**
	 * Returns:
	 * - 0 - if room was not found
	 * - 1 - if user is not owner of room
	 * - 2 - if room was deleted
	 */
	deleteRoom(user: User, code: string): Promise<0 | 1 | 2>
	getRoom(code: string): Promise<mongoose.Document | null>
	getUser(id: number): Promise<mongoose.Document | null>
	isUserOwnerOfRoom(user: User, code: string): Promise<Boolean>
	connection: mongoose.Connection
}

export default class DatabaseAdapter implements IDatabaseAdapter {
	connection: mongoose.Connection
	RoomModel: mongoose.Model<mongoose.Document>
	ParticipantModel: mongoose.Model<mongoose.Document>
	UserModel: mongoose.Model<mongoose.Document>

	constructor(URL: string) {
		this.connection = mongoose.createConnection(URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})

		this.RoomModel = this.connection.model('Room', RoomSchema, 'rooms')
		this.ParticipantModel = this.connection.model('Participant', ParticipantSchema)
		this.UserModel = this.connection.model('User', UserSchema, 'users')
	}

	_convertUserIntoParticipant(user: User): Participant {
		return {
			first_name: user.first_name,
			last_name: user.last_name,
			id: user.id,
			sex: user.sex,
			wishlist: '',
		} as Participant
	}

	async createRoom(name: string, code: string, ownerData: User): Promise<mongoose.Document> {
		const RoomModel = this.connection.model('Room', RoomSchema, 'rooms')

		const response = await new RoomModel({
			name,
			code,
			owner: ownerData,
			participants: [],
		} as Room).save()

		await this.addUserToRoom(ownerData, code)

		return response
	}

	async getRoom(code: string): Promise<mongoose.Document | null> {
		return await this.RoomModel.findOne({ code })
	}

	async getUser(id: number): Promise<mongoose.Document | null> {
		return await this.UserModel.findOne({ id })
	}

	async addUserToRoom(userData: User, code: string): Promise<0 | 1 | 2> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		if (!roomFound) return 0

		const userAlreadyInRoom: Boolean = Boolean(
			roomFound.participants.find((userInRoom) => userData.id === userInRoom.id)
		)
		if (userAlreadyInRoom) return 1

		await this.RoomModel.updateOne(
			{ code },
			{ $push: { participants: this._convertUserIntoParticipant(userData) } }
		)
		await this.saveRoomInUserProfile(userData, code)

		return 2
	}

	async deleteUserFromRoom(userData: User, code: string): Promise<0 | 1 | 2 | 3> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		if (!roomFound) return 0

		const userAlreadyInRoom = roomFound.participants.find(
			(userInRoom) => userData.id === userInRoom.id
		)
		if (!userAlreadyInRoom) return 1

		if (await this.isUserOwnerOfRoom(userData, code)) return 2

		await this.RoomModel.updateOne({ code }, { $pull: { participants: { id: userData.id } } })
		await this.UserModel.updateOne({ id: userData.id }, { $pull: { rooms: { code: code } } })

		// Room will be deleted if it has not at least one participant
		const room = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		if (room.participants.length === 0) await this.deleteRoom(room.owner, code)

		return 3
	}

	async addWishlist(
		user: User,
		code: string,
		wishlist: string
	): Promise<mongoose.Document | null> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		const userFound = roomFound.participants.find((u: Participant) => u.id === user.id)
		if (!userFound || !roomFound) return null

		userFound.wishlist = wishlist
		await roomFound.save()

		return roomFound
	}

	async saveUser(user: User): Promise<mongoose.Document> {
		const userFound = await this.getUser(user.id)
		if (userFound) return userFound
		return await new this.UserModel(user).save()
	}

	async saveRoomInUserProfile(user: User, code: string): Promise<mongoose.Document | null> {
		const room = (await this.getRoom(code)) as mongoose.Document & Room

		return await this.UserModel.updateOne({ id: user.id }, { $push: { rooms: room } })
	}

	async deleteRoom(user: User, code: string): Promise<0 | 1 | 2> {
		const room = (await this.RoomModel.findOne({ code })) as mongoose.Document & Room
		if (!room) return 0
		if (!(await this.isUserOwnerOfRoom(user, code))) return 1

		room.participants.map(async ({ id }) => {
			// removes room from users' "rooms" field
			await this.UserModel.updateOne({ id: id }, { $pull: { rooms: { code: code } } })
		})

		await this.RoomModel.deleteOne({ code })

		return 2
	}

	async isUserOwnerOfRoom(user: User, code: string): Promise<Boolean> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		return roomFound.owner.id === user.id
	}
}
