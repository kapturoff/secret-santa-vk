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
	sex: {
		type: Number,
		enum: [0, 1, 2],
	},
})

const UserModel = mongoose.model('User', UserSchema)

export { UserSchema, UserModel }
