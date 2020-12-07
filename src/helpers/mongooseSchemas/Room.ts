import mongoose from 'mongoose'
import { UserSchema } from './User'
const Schema = mongoose.Schema

const RoomSchema = new Schema({
	code: String,
	name: String,
	participants: [UserSchema],
	owner: UserSchema,
})

export { RoomSchema }
