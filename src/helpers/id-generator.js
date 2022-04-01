/**
 * Generate a random ID
 * 
*/
const randomID = () => {
	let r = Math.random().toString(32).substring(2);
	let d = Date.now().toString(32);
	let id = `${r}${d}`;
	return id;
};

export {
	randomID,
};
