import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js"

export const generateUsers = async( num = 1 ) =>{
    const users = []

    for(let i = 0; i < num; i++){
        const hashedPassword = await createHash("coder123")
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: Math.random() < 0.5 ? "user" : "admin",
            pets: [],
        })
    }

    return users
}