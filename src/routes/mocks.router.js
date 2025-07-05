import { Router } from "express";
import { faker } from "@faker-js/faker";
import { generateUsers } from "../mocking/userMocking.js";
import UserModel from "../dao/models/User.js"
import PetModel from "../dao/models/Pet.js"

const router = Router()

/**
 * @swagger
 * tags:
 *     name: Mocking
 *     description: Endpoints para generar datos falsos
 */

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Genera y devuelve 50 mascotas ficticias (no se guardan en la base de datos)
 *     tags: [Mocking]
 *     responses:
 *       200:
 *         description: Lista de mascotas ficticias generadas con Faker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       specie:
 *                         type: string
 *                       birthDate:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error interno del servidor
 */


router.get("/mockingpets", (req, res) => {
    try {
        const pets = []

        for (let i = 0; i < 50; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: "dog",
                birthDate: faker.date.past()
            })
        }

        res.status(200).send({ status: "succes", payload: pets })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
})

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Genera y devuelve 50 usuarios ficticios (no se guardan en la base de datos)
 *     tags: [Mocking]
 *     responses:
 *       200:
 *         description: Lista de usuarios ficticios generados con Faker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true
 *       500:
 *        description: Error interno del servidor  
 */


router.get("/mockingusers", async (req, res) => {
    try {
        const users = await generateUsers(50)
        res.status(200).send({ status: "succes", payload: users })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
})

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera e inserta usuarios y mascotas ficticias en la base de datos
 *     tags: [Mocking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 description: Cantidad de usuarios a generar
 *                 example: 10
 *               pets:
 *                 type: integer
 *                 description: Cantidad de mascotas a generar
 *                 example: 15
 *     responses:
 *       201:
 *         description: Datos generados e insertados exitosamente en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 users:
 *                   type: integer
 *                 pets:
 *                   type: integer
 *       400:
 *          description: Datos incorrectos
 *       500:
 *         description: Error interno del servidor
 */



router.post("/generateData", async (req, res) => {
    try {

        const { users = 0, pets = 0 } = req.body

        if ( typeof users !== "number" || typeof pets !== "number" || users < 0 || pets < 0 ||  (users === 0 && pets === 0) ) {
            return res
                .status(400)
                .send({ status: "error", error: "Invalid or missing input data" });
        }

        const usersToInsert = await generateUsers(users)
        const petsToInsert = []

        for (let i = 0; i < pets; i++) {
            petsToInsert.push({
                name: faker.animal.cat(),
                specie: "cat",
                birthDate: faker.date.past()
            })
        }

        const insertedUsers = await UserModel.insertMany(usersToInsert)
        const insertedPets = await PetModel.insertMany(petsToInsert)

        res.status(201).send({
            status: "succes",
            message: "Datos generados e instertados correctamente",
            users: insertedUsers.length,
            pets: insertedPets.length,
        })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
})

export default router