import request from "supertest"
import mongoose from "mongoose"
import app from "../../app.js"
import dotenv from "dotenv"
dotenv.config();


describe("GET /api/mocks/mockingpets", () => {
    it("Deberia volver un array de 50 mascotas mockeadas", async () => {
        const response = await request(app).get("/api/mocks/mockingpets")
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("succes")
        expect(Array.isArray(response.body.payload)).toBe(true)
        expect(response.body.payload.length).toBe(50)
    })
})

describe("GET /api/mocks/mockingusers", () => {
    it("Deberia volver un array de 50 usuarios mockeados", async () => {
        const response = await request(app).get("/api/mocks/mockingusers")
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("succes")
        expect(Array.isArray(response.body.payload)).toBe(true)
        expect(response.body.payload.length).toBe(50)
    })
})

describe("POST /api/mocks/generateData", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    it("Deberia insertar usuarios y mascotas en la base de datos", async () => {
        const payload = { users: 3, pets: 2 }
        const response = await request(app)
            .post("/api/mocks/generateData")
            .send(payload)
            .set("Content-Type", "application/json")
            .catch(err => {
                console.error("ERROR EN REQUEST:", err);
                throw err;
            });
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("succes")
        expect(response.body.users).toBe(3)
        expect(response.body.pets).toBe(2)
    }, 20000)

    it("Deberia devolver error 400 si el payload esta mal formado", async () => {

        const response = await request(app)
            .post("/api/mocks/generateData")
            .send({ users: -1, pets: "dos" })
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.error).toBe("Invalid or missing input data");
    });

    it("Deberia fallar si no se envia ningun body", async () => {
        const response = await request(app)
            .post("/api/mocks/generateData")
            .send() 
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.error).toBe("Invalid or missing input data");
    });


    afterAll(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})