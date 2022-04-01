import 'dotenv/config';

/**
 * Get info about the API
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getHome = (req, res, next) => {
	let jsonResponse, status, port, startpoint;
	const { hostname, protocol, secure } = req;
	port = Number(process.env.PORT);
	startpoint = `${protocol}://${hostname}:${port}`;
	status = 200;
	jsonResponse = {
		msg: 'Welcome. This is the API of MERN Uptask V2',
		server: {
			hostname,
			port,
			protocol,
			secure,
		},
		startpoint,
		endpoints: {
			availables: {
				home: [
					'/',
				],
				users: [
					'/api/users',
					'/api/users/create',
					'/api/users/update',
					'/api/users/delete',
					'/api/users/login',
					'/api/users/confirm/:token',
					'/api/users/forgot',
					'/api/users/forgot/:token',
				],
				projects: [
					'/api/projects/all',
					'/api/projects/:id',
					'/api/projects/create',
					'/api/projects/update/:id',
					'/api/projects/delete/:id',
					'/api/projects/colaborator/create',
					'/api/projects/colaborator/delete/:id',
				],
			},
		},
		methods: {
			availables: [
				'GET',
				'POST',
				'PUT',
				'DELETE',
			],
		},
	};
	return res.status(status).json(jsonResponse);
};

export {
	getHome,
};
