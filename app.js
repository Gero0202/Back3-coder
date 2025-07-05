import express from 'express';
import cookieParser from 'cookie-parser';
import usersRouter from "./src/routes/users.router.js"
import petsRouter from './src/routes/pets.router.js';
import adoptionsRouter from './src/routes/adoption.router.js';
import sessionsRouter from "./src/routes/sessions.router.js"
import mocksRouter from "./src/routes/mocks.router.js"
import { setUpSwagger } from './src/swagger.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

setUpSwagger(app)


app.use("/api/mocks", mocksRouter)

export default app

