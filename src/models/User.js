import mongoose from 'mongoose';

const { Schema, model } = mongoose;

import { encryptPassword } from '../helpers/encryption.js';

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		token: {
			type: String,
			default: '',
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await encryptPassword(this.password);
});

const User = model('User', userSchema);

export default User;
