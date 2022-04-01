import 'dotenv/config';
import express from 'express';

import connectDB from './src/config/db.js';
import routes from './src/routes/index.js';
import {
	httpCreateError,
	httpErrorHandler
} from './src/handlers/http-error-handler.js';
import { useCors } from './src/handlers/cors-handler.js';

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

connectDB(process.env.MONGODB_URI_REMOTE);

app.use(useCors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes());

app.use(httpCreateError);
app.use(httpErrorHandler);

app.listen(PORT, HOST, () => console.log(`Server on port ${PORT}`));
