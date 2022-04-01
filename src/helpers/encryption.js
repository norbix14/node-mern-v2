import bcryp from 'bcrypt';

/**
 * Hash the provided password
 * 
 * @param {String} plain - plain password
*/
const encryptPassword = async (plain) => {
	const salt = await bcryp.genSalt(10);
	const hashed = await bcryp.hash(plain, salt);
	return hashed;
};

/**
 * Verify if the plain password match with the hashed one
 * 
 * @param {String} plain - plain password
 * @param {String} hash - hashed password
*/
const verifyPassword = async (plain, hash) => {
	return await bcryp.compare(plain, hash);
};

export {
	encryptPassword,
	verifyPassword,
};
