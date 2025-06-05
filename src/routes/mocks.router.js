import { Router } from "express";
import { faker } from "@faker-js/faker";
import { generateUsers } from "../mocking/userMocking.js";
import UserModel from "../dao/models/User.js"
import PetModel from "../dao/models/Pet.js"

const router = Router()


router.get("/mockingpets", (req, res) =>{
    const pets = []

    for(let i = 0; i < 50; i++){
        pets.push({
            name: faker.animal.dog(),
            specie: "dog",
            birthDate: faker.date.past()
        })
    }

    res.status(200).send({ status: "succes", payload: pets })
})



router.get("/mockingusers", async(req, res) =>{
    const users = await generateUsers(50)
    res.status(200).send({ status: "succes", payload: users })
})



router.post("/generateData", async(req, res) =>{
    const { users = 0, pets = 0 } = req.body

    const usersToInsert = await generateUsers(users)
    const petsToInsert = []

    for(let i = 0; i < pets; i++){
        petsToInsert.push({
            name: faker.animal.cat(),
            specie: "cat",
            birthDate: faker.date.past()
        })
    }

    const insertedUsers = await UserModel.insertMany(usersToInsert)
    const insertedPets = await PetModel.insertMany(petsToInsert)

    res.status(200).send({
        status: "succes",
        message: "Datos generados e instertados correctamente",
        users: insertedUsers.length,
        pets: insertedPets.length,
    })
})

export default router