import { verifyJwt } from '../helpers/jwt-generator.js';

/**
 * Get the token in the Authorization Header
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getTokenFromHeaders = (req, res, next) => {
	let jsonResponse, status, token;
	const { headers: { authorization } } = req;
	jsonResponse = {
		details: {},
		msg: 'Invalid or empty token',
		user: {},
	};
	try {
		token = authorization.split(' ')[1];
		if (token) {
			req.authToken = token;
			return next();
		} else {
			status = 404;
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
 * Ask if the JSONWEBTOKEN is valid
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askTokenIsValid = (req, res, next) => {
	let jsonResponse, status, validAndDecodedToken;
	const { authToken } = req;
	jsonResponse = {
		details: {},
		msg: 'Invalid or expired token',
		user: {},
		token: '',
	};
	try {
		validAndDecodedToken = verifyJwt(authToken);
		if (validAndDecodedToken) {
			req.authToken = validAndDecodedToken;
			return next();
		} else {
			status = 400;
		}
	} catch (error) {
		delete req.authToken;
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
	getTokenFromHeaders,
	askTokenIsValid,
};
