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
					['GET', '/'],
				],
				projects: [
					['GET', '/api/projects/all'],
					['GET', '/api/projects/:id'],
					['POST', '/api/projects/create'],
					['PUT', '/api/projects/update/:id'],
					['DELETE', '/api/projects/delete/:id'],
					['POST', '/api/projects/colaborator/create'],
					['POST', '/api/projects/colaborator/delete/:id'],
				],
				tasks: [
					['GET', '/api/tasks/all'],
					['GET', '/api/tasks/projects/:id'],
					['GET', '/api/tasks/:id'],
					['POST', '/api/tasks/create'],
					['PUT', '/api/tasks/update/:id'],
					['DELETE', '/api/tasks/delete/:id'],
					['POST', '/api/tasks/status/:id'],
				],
				users: [
					['GET', '/api/users'],
					['POST', '/api/users/create'],
					['PUT', '/api/users/update'],
					['DELETE', '/api/users/delete'],
					['POST', '/api/users/login'],
					['GET', '/api/users/confirm/:token'],
					['POST', '/api/users/forgot'],
					['GET', '/api/users/forgot/:token'],
					['GET', '/api/users/profile'],
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
