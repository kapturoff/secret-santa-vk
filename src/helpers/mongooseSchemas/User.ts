import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	id: {
		type: Number,
		required: true,
	},
	rooms: {
        type: Array,
        default: [],
    }
})

export { UserSchema }
