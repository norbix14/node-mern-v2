import 'dotenv/config';
import jwt from 'jsonwebtoken';

/**
 * Generate a JSONWEBTOKEN string
 * 
 * @param {Object} payload - an object with data
 * @param {Object} options - an object with data to
 * sign the JSONWEBTOKEN
*/
const generateJWT = (payload, options = {}) => {
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

export {
	generateJWT,
	verifyJwt,
};
