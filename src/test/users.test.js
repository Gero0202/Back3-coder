import request from "supertest"
import mongoose from "mongoose"
import app from "../../app.js"
import dotenv from "dotenv"
dotenv.config();

const MONGO_URL_TEST = process.env.MONGO_URL

describe("GET /api/users/", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
    });

    it("Deberia devolver todos los users de la base de datos", async () => {
        await mongoose.connection.db.collection("users").insertMany([
            { first_name: "Carlitos", last_name: "Perez", email: "carlitosperez@gmail", password: "Hola123" },
            { first_name: "Luna", last_name: "Alma", email: "lunaAlma@gmail", password: "Hola123" }
        ])
        const response = await request(app).get("/api/users")
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        expect(Array.isArray(response.body.payload)).toBe(true)
        expect(response.body.payload.length).toBe(2)
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.close();
    });
})

describe("Test para /api/users/:uid que necesitan ID", () => {
    let createdUserId;

    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
        const result = await mongoose.connection.db.collection("users").insertOne({
            first_name: "Test",
            last_name: "User",
            email: "test@test.com",
            password: "1234",
        });
        createdUserId = result.insertedId.toString();
    });



    describe("GET /api/users/:uid", () => {
        it("Deberia devolver el usuario si el ID existe", async () => {
            const response = await request(app).get(`/api/users/${createdUserId}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
            expect(response.body.payload._id).toBe(createdUserId)
        })

        it("Deberia volver 404 si el user no existe", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString()
            const response = await request(app).get(`/api/users/${fakeId}`)
            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toMatch(/not found/i)
        })

        it("Deberia volver 500 si el ID esta mal fromado", async () => {
            const response = await request(app).get(`/api/users/1234`)
            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe("error");
        })
    })

    describe("PUT /api/users/:uid", () => {
        it("Deberia actualizar los datos del usuario", async () => {
            const updated = { first_name: "Actualizado" }
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .send(updated)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
        })

        it("Deberia devolver 404 si el usuario no existe", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString()
            const response = await request(app)
                .put(`/api/users/${fakeId}`)
                .send({ first_name: "No existe" })
            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
        })

        it("Deberia devolver 500 si el ID esta mal formado", async () => {
            const response = await request(app)
                .put(`/api/users/1234`)
                .send({ first_name: "Error" })
            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe("error");
        })
    })

    describe("DELETE /api/users/:uid", () =>{
        it("Deberia eliminar el usuario", async() =>{
            const response = await request(app).delete(`/api/users/${createdUserId}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
        })

        it("Deberai devolver 404 si el user no existe", async() =>{
            const fakeId = new mongoose.Types.ObjectId().toString()
            const response = await request(app).delete(`/api/users/${fakeId}`)
            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
        })

        it("Deberia devolver 500 si el ID esta mal formado", async() =>{
            const response = await request(app).delete(`/api/users/1234`)
            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe("error");
        })
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.close();
    });
})


