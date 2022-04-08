import 'dotenv/config';
import jwt from 'jsonwebtoken';

/**
 * Generate a JSONWEBTOKEN string
 * 
 * @param {Object} payload - an object with data
 * @param {Object} options - an object with data to
 * sign the JSONWEBTOKEN
*/
const generateJwt = (payload, options = {}) => {
	const secret = process.env.JWT_SECRET;
	const opts = {
		expiresIn: '1h',
		...options
	};
	const signed = jwt.sign(payload, secret, opts);
	return signed;
};

/**
 * Verify the JSONWEBTOKEN
 * 
 * @param {String} token - JSONWEBTOKEN
*/
const verifyJwt = (token) => {
	const secret = process.env.JWT_SECRET;
  const verified = jwt.verify(token, secret);
  return verified;
};

/**
 * Decode the JSONWEBTOKEN
 * 
 * @param {String} token - JSONWEBTOKEN
*/
const decodeJwt = (token) => {
	const secret = process.env.JWT_SECRET;
	let response;
	jwt.verify(token, secret, function(error, decoded) {
		if (error) {
			response = {
				...error,
			};
		} else if (decoded) {
			response = {
				...decoded,
			};
		} else {
			response = {
				error: 'JWT ERROR',
			};
		}
	});
	return response;
}

export {
	generateJwt,
	verifyJwt,
	decodeJwt,
};
