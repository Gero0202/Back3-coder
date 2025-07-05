import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Pets
 *     description: Endpoints para gestionar los pets
 */


/**
 * @swagger
 * /api/pets/:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */

router.get('/',petsController.getAllPets);

/**
 * @swagger
 * /api/pets/:
 *   post:
 *     summary: Crear una nueva mascota (sin imagen)
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *       400:
 *         description: Valores incompletos o invalidos
 *       500:
 *         description: Error interno del servidor
 */


router.post('/',petsController.createPet);

/**
 * @swagger
 * /api/pets/withimage:
 *   post:
 *     summary: Crear una mascota con imagen
 *     tags: [Pets]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente con imagen
 *       400:
 *         description: Datos incompletos o archivo faltante
 *       500:
 *         description: Error interno del servidor
 */


router.post('/withimage',uploader.single('image'), petsController.createPetWithImage);


/**
 * @swagger
 * /api/pets/{pid}:
 *   put:
 *     summary: Actualizar mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Firulais
 *               specie: dog
 *               birthDate: "2020-01-01"
 *     responses:
 *       200:
 *         description: Mascota actualizada correctamente
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.put('/:pid',petsController.updatePet);

/**
 * @swagger
 * /api/pets/{pid}:
 *   delete:
 *     summary: Eliminar mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a eliminar
 *     responses:
 *       200:
 *         description: Mascota eliminada correctamente
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.delete('/:pid',petsController.deletePet);

export default router;