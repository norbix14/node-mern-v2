import { Router } from 'express';

import { getHome } from '../../controllers/home/index.js';

const router = Router();

export default function () {
	// base: "/"
	router.get(
		'/',
		getHome
	);
	return router;
}
