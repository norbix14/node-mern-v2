import { Router } from 'express';

import {
	askAuthorizationHeaderExist
} from '../../middlewares/header.js';

import {
	getTokenFromHeaders,
	askTokenIsValid
} from '../../middlewares/auth.js';

import {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	addColaborator,
	deleteColaborator,
	askProjectExistById,
	aksProjectOwnership
} from '../../controllers/project/index.js';

const router = Router();

export default function() {
	// base: "/projects"
	router.all(
		'*',
		askAuthorizationHeaderExist,
		getTokenFromHeaders,
		askTokenIsValid
	);
	router.get(
		'/all',
		getProjects
	);
	router.get(
		'/:id',
		askProjectExistById,
		aksProjectOwnership,
		getProject
	);
	router.post(
		'/create',
		createProject
	);
	router.put(
		'/update/:id',
		askProjectExistById,
		aksProjectOwnership,
		updateProject
	);
	router.delete(
		'/delete/:id',
		askProjectExistById,
		aksProjectOwnership,
		deleteProject
	);
	router.post(
		'/colaborator/create',
		addColaborator
	);
	router.post(
		'/colaborator/delete/:id',
		deleteColaborator
	);
	return router;
}
