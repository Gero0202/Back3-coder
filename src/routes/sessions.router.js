import { Router } from 'express';
import sessionsController from "../controllers/sessions.controllers.js"
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Endpoints de autenticación y sesión de usuario
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             example:
 *               first_name: Sol
 *               last_name: Luna
 *               email: sol@example.com
 *               password: hola1234
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Valores incompletos , invalid values o usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */


router.post('/register',sessionsController.register);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Iniciar sesión (protegida con cookie segura)
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: juan@example.com
 *               password: hola1234
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */


router.post('/login',sessionsController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtener el usuario actual desde cookie protegida
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Token inválido, expirado o no proporcionado
 */


router.get('/current',sessionsController.current);

/**
 * @swagger
 * /api/sessions/unprotectedLogin:
 *   post:
 *     summary: Iniciar sesión (sin seguridad adicional)
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: sol@example.com
 *               password: hola1234
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso (sin protección)
 *       400:
 *         description: Valores incompletos
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */


router.post('/unprotectedLogin',sessionsController.unprotectedLogin);


/**
 * @swagger
 * /api/sessions/unprotectedCurrent:
 *   get:
 *     summary: Obtener el usuario actual desde cookie sin protección
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *       401:
 *         description: Token inválido, expirado o no proporcionado
 */


router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);

export default router;