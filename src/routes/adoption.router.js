import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Adoptions
 *     description: Endpoints para gestionar las adopciones
 */

/**
 * @swagger
 * /api/adoptions/:
 *   get:
 *     summary: Obtener todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */

router.get('/',adoptionsController.getAllAdoptions);

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtener adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - name: aid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción a buscar
 *     responses:
 *       200:
 *         description: Adopción encontrada correctamente
 *       404:
 *         description: Adopción no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.get('/:aid',adoptionsController.getAdoption);

/**
 * @swagger
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Registrar adopción de una mascota por un usuario
 *     tags: [Adoptions]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario adoptante
 *       - name: pid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a adoptar
 *     responses:
 *       201:
 *         description: Adopción registrada correctamente
 *       400:
 *         description: La mascota ya fue adoptada
 *       404:
 *         description: Usuario o mascota no encontrados
 *       500:
 *         description: Error interno del servidor
 */


router.post('/:uid/:pid',adoptionsController.createAdoption);

export default router;