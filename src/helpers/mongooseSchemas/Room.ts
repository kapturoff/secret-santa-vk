import mongoose from 'mongoose'
import { ParticipantSchema } from './Participant'
const Schema = mongoose.Schema

const RoomSchema = new Schema({
	code: String,
	name: String,
	participants: [ParticipantSchema],
	owner: ParticipantSchema,
})

export { RoomSchema }
