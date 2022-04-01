import 'dotenv/config';
import cors from 'cors';

const DOMAINS = String(process.env.CORS_WHITELIST_LOCAL);

const whitelist = [...DOMAINS.split(',')];

const corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Permission denied'));
		}
	},
};

const useCors = () => cors(corsOptions);

export {
	useCors,
};
