import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const taskSchema = new Schema(
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
		status: {
			type: Boolean,
			default: false,
		},
		timeline: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		priority: {
			type: String,
			required: true,
			enum: ['Low', 'Medium', 'High'],
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
		},
	},
	{
		timestamps: true,
	}
);

const Task = model('Task', taskSchema);

export default Task;
