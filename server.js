// server.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import logger from './src/utils/logger.js';

dotenv.config();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info("Conectado a MongoDB correctamente")
        app.listen(PORT, () => {
            logger.info(`Servidor escuchando en puerto ${PORT}`)
        });
    })
    .catch(err => {
        logger.error("Error al conectar con MongoDB: ",err)
    });
