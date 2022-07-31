import { Router } from 'express';

import {
	askAuthorizationHeaderExist
} from '../../middlewares/header.js';

import {
	getTokenFromHeaders,
	askTokenIsValid
} from '../../middlewares/auth.js';

import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	loginUser,
	askUserEmailIsInUse,
	askUserAccountIsConfirmed,
	askUserPasswordMatch,
	askUserTokenIsValid,
	checkUserExistByEmail,
	checkUserExistByToken,
	checkUserExistAndInformRecoverySteps,
	checkUserExistAndResetPassword,
	informUserAccountIsConfirmed,
	getUserProfileData,
	sessionExtension,
} from '../../controllers/user/index.js';

const router = Router();

export default function () {
	// base: "/users"
	router.get(
		'/',
		getUsers
	);
	router.post(
		'/create',
		askUserEmailIsInUse,
		createUser
	);
	router.put(
		'/update',
		updateUser
	);
	router.delete(
		'/delete',
		deleteUser
	);
	router.post(
		'/login',
		checkUserExistByEmail,
		askUserAccountIsConfirmed,
		askUserPasswordMatch,
		loginUser
	);
	router.post(
		'/session/extend',
		checkUserExistByEmail,
		askUserAccountIsConfirmed,
		sessionExtension
	);
	router.get(
		'/confirm/:token',
		checkUserExistByToken,
		informUserAccountIsConfirmed
	);
	router.post(
		'/forgot',
		checkUserExistByEmail,
		checkUserExistAndInformRecoverySteps
	);
	router.get(
		'/forgot/:token',
		askUserTokenIsValid
	);
	router.post(
		'/forgot/:token',
		checkUserExistAndResetPassword
	);
	router.get(
		'/profile',
		askAuthorizationHeaderExist,
		getTokenFromHeaders,
		askTokenIsValid,
		getUserProfileData
	);
	return router;
}
