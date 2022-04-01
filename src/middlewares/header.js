/**
 * Ask if the Authorization Header exist
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askAuthorizationHeaderExist = (req, res, next) => {
	let jsonResponse, status;
	const { headers: { authorization } } = req;
	jsonResponse = {
		details: {},
		msg: 'The Authorization Header is missing',
		user: {},
	};
	try {
		if (authorization) {
			if (authorization.startsWith('Bearer')) {
				return next();
			} else {
				jsonResponse.msg = 'The Authorization Header has invalid format';
				status = 401;
			}
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

export {
	askAuthorizationHeaderExist,
};
