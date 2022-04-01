import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const projectSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		timeline: {
			type: Date,
			default: Date.now(),
		},
		client: {
			type: String,
			trim: true,
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		colaborators: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			}
		],
	},
	{
		timestamps: true,
	}
);

const Project = model('Project', projectSchema);

export default Project;
