import mongoose from 'mongoose'
import { User, Room } from 'interfaces'
import { RoomSchema } from '../mongooseSchemas/Room'
import { UserSchema } from '../mongooseSchemas/User'

export interface IDatabaseAdapter {
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
	 * - 2 - if user leaved a room
	 */
	deleteUserFromRoom(user: User, code: string): Promise<0 | 1 | 2>
	addWishlist(user: User, code: string, wishlist: string): Promise<mongoose.Document | null>
	connection: mongoose.Connection
}

export default class DatabaseAdapter implements IDatabaseAdapter {
	connection: mongoose.Connection
	RoomModel: mongoose.Model<mongoose.Document>
	UserModel: mongoose.Model<mongoose.Document>

	constructor(URL: string) {
		this.connection = mongoose.createConnection(URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})

		this.RoomModel = this.connection.model('Room', RoomSchema, 'rooms')
		this.UserModel = this.connection.model('User', UserSchema)
	}

	async createRoom(name: string, code: string, owner: User): Promise<mongoose.Document> {
		const RoomModel = this.connection.model('Room', RoomSchema, 'rooms')

		const response = await new RoomModel({
			name,
			code,
			owner,
			participants: [owner],
		} as Room).save()

		return response
	}

	async addUserToRoom(userData: User, code: string): Promise<0 | 1 | 2> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		if (!roomFound) return 0

		const userAlreadyInRoom: Boolean = Boolean(
			roomFound.participants.find((userInRoom) => userData.id === userInRoom.id)
		)
		if (userAlreadyInRoom) return 1

		const userBuilt = new this.UserModel(userData)
		this.RoomModel.updateOne({ code }, { $push: { participants: userBuilt } })

		return 2
	}

	async deleteUserFromRoom(userData: User, code: string): Promise<0 | 1 | 2> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		if (!roomFound) return 0

		const userAlreadyInRoom = roomFound.participants.find(
			(userInRoom) => userData.id === userInRoom.id
		)
		if (!userAlreadyInRoom) return 1

		await this.RoomModel.updateOne({ code }, { $pull: { participants: { id: userData.id } } })
		return 2
	}

	async addWishlist(user: User, code: string, wishlist: string): Promise<mongoose.Document | null> {
		const roomFound = (await this.RoomModel.findOne({ code })) as Room & mongoose.Document
		const userFound = roomFound.participants.find((u: User) => u.id === user.id)
		if (!userFound) return null

		userFound.wishlist = wishlist
		await roomFound.save()
		
		return roomFound
	}
}
