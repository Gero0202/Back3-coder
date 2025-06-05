import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usersRouter from "./src/routes/users.router.js"
import petsRouter from './src/routes/pets.router.js';
import adoptionsRouter from './src/routes/adoption.router.js';
import sessionsRouter from "./src/routes/sessions.router.js"
import mocksRouter from "./src/routes/mocks.router.js"

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("🟢 Conectado a MongoDB correctamente")
        app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`))
    })
    .catch(err => {
        console.error("🔴 Error al conectar con MongoDB:", err)
    })

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);


app.use("/api/mocks", mocksRouter)

