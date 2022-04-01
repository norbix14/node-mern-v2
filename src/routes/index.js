import express from 'express';

import home from './home/index.js';
import user from './user/index.js';
import project from './project/index.js';
import task from './task/index.js';

const app = express();

export default function () {
	app.use('/', home());
	app.use('/api/users', user());
	app.use('/api/projects', project());
	app.use('/api/tasks', task());
	return app;
}
