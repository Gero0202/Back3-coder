import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints para gestionar los usuarios
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error interno del servidor
 */
router.get('/',usersController.getAllUsers);



/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:uid',usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               first_name: Juan
 *               last_name: Pérez
 *               email: juan@example.com
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.put('/:uid',usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.delete('/:uid',usersController.deleteUser);


export default router;