import { Router } from 'express';

import {
	askAuthorizationHeaderExist
} from '../../middlewares/header.js';

import {
	getTokenFromHeaders,
	askTokenIsValid
} from '../../middlewares/auth.js';

import {
	getTasks,
	getTask,
	updateTask,
	deleteTask,
	createTask,
	updateTaskStatus,
	askProjectExistById,
	askProjectOwnership,
	getTasksByProjectId,
	askTaskExistById,
	askTaskOwnership
} from '../../controllers/task/index.js';

const router = Router();

export default function() {
	// base: "/tasks"
	router.all(
		'*',
		askAuthorizationHeaderExist,
		getTokenFromHeaders,
		askTokenIsValid
	);
	router.get(
		'/all',
		getTasks
	);
	router.get(
		'/projects/:id',
		getTasksByProjectId
	);
	router.get(
		'/:id',
		askTaskExistById,
		askTaskOwnership,
		getTask
	);
	router.post(
		'/create',
		askProjectExistById,
		askProjectOwnership,
		createTask
	);
	router.put(
		'/update/:id',
		askTaskExistById,
		askTaskOwnership,
		updateTask
	);
	router.delete(
		'/delete/:id',
		askTaskExistById,
		askTaskOwnership,
		deleteTask
	);
	router.post(
		'/status/:id',
		updateTaskStatus
	);
	return router;
}
