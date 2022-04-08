import User from '../../models/User.js';

import {
	randomID
} from '../../helpers/id-generator.js';
import {
	generateJwt,
	decodeJwt
} from '../../helpers/jwt-generator.js';
import {
	encryptPassword,
	verifyPassword
} from '../../helpers/encryption.js';

import {
	userRegister,
	userRecovery
} from '../../handlers/nodemailer-handler.js'

/**
 * Get all users
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getUsers = async (req, res, next) => {
	let jsonResponse, status, users;
	jsonResponse = {
		details: {},
		msg: 'Users list',
		users: [],
	}
	try {
		users = await User.find().select('-password');
		jsonResponse.users = users;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Create user
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const createUser = async (req, res, next) => {
	let jsonResponse, status, user, saved;
	const { body } = req;
	jsonResponse = {
		details: {},
		msg: 'User created',
		user: {},
	};
	try {
		user = new User(body);
		user.token = randomID();
		saved = await user.save();
		saved.password = '**********';
		await userRegister({
			email: saved.email,
			name: saved.name,
			token: saved.token,
		});
		jsonResponse.user = saved;
		jsonResponse.msg = 'Welcome! Now, check your email and follow the instructions';
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Update user
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const updateUser = async (req, res, next) => {
	let jsonResponse, status;
	jsonResponse = {
		details: {},
		msg: 'User updated',
		user: {},
	};
	try {
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Delete user
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const deleteUser = async (req, res, next) => {
	let jsonResponse, status;
	jsonResponse = {
		details: {},
		msg: 'User deleted',
		user: {},
	};
	try {
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Check if the user's email exist and add it's data to
 * the request
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const checkUserExistByEmail = async (req, res, next) => {
	let jsonResponse, status, userExist;
	const { body } = req;
	const { email } = body;
	jsonResponse = {
		details: {},
		msg: 'User exist',
		user: {},
	};
	try {
		userExist = await User.findOne({ email });
		if (userExist) {
			req.currentUser = userExist;
			return next();
		} else {
			status = 404;
			throw new Error('User does not exist');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the user's email is in use and go to the next
 * middleware or return an error response
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askUserEmailIsInUse = async (req, res, next) => {
	let jsonResponse, status, userEmailExist;
	const { body } = req;
	const { email } = body;
	jsonResponse = {
		details: {},
		msg: 'User email already exist',
		user: {},
	};
	try {
		userEmailExist = await User.findOne({ email });
		if (userEmailExist) {
			status = 400;
			throw new Error('User email already exists');
		} else {
			return next();
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Check if an user exist by the token provided in the Authorization
 * Header
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const checkUserExistByToken = async (req, res, next) => {
	let jsonResponse, status, userExist, token;
	const { params } = req;
	jsonResponse = {
		details: {},
		msg: 'User account exist',
		user: {},
	};
	try {
		token = params.token || '';
		userExist = await User.findOne({ token });
		if (userExist) {
			userExist.confirmed = true;
			userExist.token = '';
			await userExist.save();
			req.currentUser = userExist;
			return next();
		} else {
			status = 404;
			throw new Error('User does not exist. Invalid token');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			...error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the user's account is confirmed and go to the next
 * middleware or return an error response
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askUserAccountIsConfirmed = async (req, res, next) => {
	let jsonResponse, status;
	const { currentUser } = req;
	jsonResponse = {
		details: {},
		msg: 'User confirmed',
		user: {},
	};
	try {
		if (currentUser.confirmed) {
			return next();
		} else {
			delete req.currentUser;
			status = 400;
			throw new Error('User does not have an active account');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the user password match
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askUserPasswordMatch = async (req, res, next) => {
	let jsonResponse, status, passwordMatch;
	const { body, currentUser } = req;
	const { password } = body;
	jsonResponse = {
		details: {},
		msg: 'User password match',
		user: {},
	};
	try {
		passwordMatch = await verifyPassword(password, currentUser.password);
		if (passwordMatch) {
			return next();
		} else {
			delete req.currentUser;
			status = 400;
			throw new Error('There is a problem with your password');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Log the user and return the JSONWEBTOKEN
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const loginUser = async (req, res, next) => {
	let jsonResponse, status, payload, token, decodedToken;
	const { currentUser } = req;
	jsonResponse = {
		details: {},
		msg: 'User logged',
		user: {},
		token: '',
		session: {},
	};
	try {
		payload = {
			id: currentUser._id,
		}
		token = generateJwt(payload);
		decodedToken = decodeJwt(token);
		currentUser.password = '**********';
		jsonResponse.user = currentUser;
		jsonResponse.token = token;
		jsonResponse.session = {
			creation: Number(decodedToken.iat + '000') || null,
			expiration: Number(decodedToken.exp + '000') || null,
		};
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Add the user's data in the request
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const informUserAccountIsConfirmed = async (req, res, next) => {
	let jsonResponse, status, token;
	const { currentUser } = req;
	jsonResponse = {
		details: {},
		msg: 'User account confirmed',
		user: {},
	};
	try {
		currentUser.password = '**********';
		jsonResponse.user = currentUser;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Check if the user exist, generate the recovery token and
 * send a response with the next steps
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const checkUserExistAndInformRecoverySteps = async (req, res, next) => {
	let jsonResponse, status, user, token;
	const { currentUser } = req;
	jsonResponse = {
		details: {},
		msg: 'User password recovery',
		user: {},
	};
	token = randomID();
	try {
		user = await User.findOne({ email: currentUser.email });
		user.token = token;
		await Promise.all([
			user.save(),
			userRecovery({ email: currentUser.email, token })
		]);
		jsonResponse.msg = 'Please, check your email and follow the instructions';
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the provided token is valid
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askUserTokenIsValid = async (req, res, next) => {
	let jsonResponse, status, userExist, token;
	const { params } = req;
	jsonResponse = {
		details: {},
		msg: 'User token is valid',
		user: {},
	};
	try {
		token = params.token || '';
		userExist = await User.findOne({ token });
		if (userExist) {
			status = 200;
		} else {
			status = 400;
			throw new Error('User token is invalid');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Check if the user exist and reset it's password
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const checkUserExistAndResetPassword = async (req, res, next) => {
	let jsonResponse, status, token, userExist;
	const { params, body } = req;
	const { password } = body;
	jsonResponse = {
		details: {},
		msg: 'User password restablished',
		user: {},
	};
	try {
		token = params.token || '';
		userExist = await User.findOne({ token });
		if (userExist) {
			userExist.password = password;
			userExist.token = '';
			await userExist.save();
			status = 200;
		} else {
			status = 404;
			throw new Error('User does not exist');
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Get the user's data
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getUserProfileData = async (req, res, next) => {
	let jsonResponse, status, userData;
	const { authToken, decodedToken } = req;
	jsonResponse = {
		details: {},
		msg: 'User profile data',
		user: {},
		token: '',
		session: {}
	};
	try {
		userData = await User.findById(decodedToken.id);
		userData.password = '**********';
		jsonResponse.token = authToken;
		jsonResponse.user = userData;
		jsonResponse.session = {
			creation: Number(decodedToken.iat + '000') || null,
			expiration: Number(decodedToken.exp + '000') || null,
		};
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

export {
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
};
