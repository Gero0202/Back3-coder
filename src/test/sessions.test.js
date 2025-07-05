import request from "supertest"
import mongoose from "mongoose"
import app from "../../app.js"
import dotenv from "dotenv"
dotenv.config();

const MONGO_URL_TEST = process.env.MONGO_URL

describe("Test de sessions", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
    });

    const mockUser = {
        first_name: "Luna",
        last_name: "Estrella",
        email: "lunaestrella@test.com",
        password: "123456",
    }

    describe("POST /api/sessions/register", () => {
        it("Deberia registrar un nuevo usuario", async () => {
            const response = await request(app).post("/api/sessions/register").send(mockUser)
            expect(response.statusCode).toBe(201)
            expect(response.body.status).toBe("success")
            expect(response.body.payload).toBeDefined()
        })

        it("Deberia fallar si faltan campos", async () => {
            const response = await request(app).post("/api/sessions/register").send({
                first_name: "clara"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("Incomplete values or invalid values")
        })

        it("Deberia fallar si el usuario ya existe", async () => {
            await request(app).post("/api/sessions/register").send(mockUser)
            const response = await request(app).post("/api/sessions/register").send(mockUser)
            expect(response.statusCode).toBe(400)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("User already exists")
        })
    })

    describe("POST /api/sessions/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/sessions/register").send(mockUser)
        })

        it("Deberia iniciar sesion con credenciales validas", async () => {
            const response = await request(app).post("/api/sessions/login").send({
                email: mockUser.email,
                password: mockUser.password
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
        })

        it("Deberia fallar con la password incorrecta", async () => {
            const response = await request(app).post("/api/sessions/login").send({
                email: mockUser.email,
                password: "wrongpassword"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("Incorrect password")
        })

        it("Deberia fallar si el usuario no existe", async () => {
            const response = await request(app).post("/api/sessions/login").send({
                email: "usuarioinexistente@email",
                password: "passwordinvalid"
            })
            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("User do not exist")
        })
    })

    describe("GET /api/sessions/current", () => {
        it("Deberia volver el usuario actual si esta autenticado", async () => {
            await request(app).post("/api/sessions/register").send(mockUser)
            const loginResponse = await request(app).post("/api/sessions/login").send({
                email: mockUser.email,
                password: mockUser.password
            })
            const cookie = loginResponse.headers["set-cookie"][0]
            const response = await request(app).get("/api/sessions/current").set("Cookie", cookie)

            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
            expect(response.body.payload.email).toBe(mockUser.email)
        })

        it("Deberia dar error si no hay cookie", async () => {
            const response = await request(app).get("/api/sessions/current")
            expect(response.statusCode).toBe(401)
            expect(response.body.status).toBe("error")
            expect(response.body.message).toBe("No token provided")
        })
    })

    describe("POST /api/sessions/unprotectedLogin", () => {
        beforeEach(async () => {
            await request(app).post("/api/sessions/register").send(mockUser)
        })

        it("Deberia inciar sesion sin proteccion", async () => {
            const response = await request(app).post("/api/sessions/unprotectedLogin").send({
                email: mockUser.email,
                password: mockUser.password
            })

            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
            expect(response.body.message).toBe("Unprotected Logged in")
        })

        it("Deberia fallar con datos incompletos", async () => {
            const response = await request(app).post("/api/sessions/unprotectedLogin").send({
                email: mockUser.email,
            })

            expect(response.statusCode).toBe(400)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("Incomplete values")
        })

        it("Deberia fallar si el user no existe", async () => {
            const response = await request(app).post("/api/sessions/unprotectedLogin").send({
                email: "ghost@user",
                password: "hola1223"
            })

            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("User do not exist")
        })

        it("Deberia fallar si la contraseña es invalida", async () => {
            const response = await request(app).post("/api/sessions/unprotectedLogin").send({
                email: mockUser.email,
                password: "hola1223"
            })
            expect(response.statusCode).toBe(401)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toBe("Incorrect password")
        })



    })

    describe("GET /api/sessions/unprotectedCurrent", () => {
        it("Deberia devolver el usuario actual con cookie sin proteccion", async () => {
            await request(app).post("/api/sessions/register").send(mockUser)
            const loginResponse = await request(app).post("/api/sessions/unprotectedLogin").send({
                email: mockUser.email,
                password: mockUser.password
            })

            const cookie = loginResponse.headers["set-cookie"][0]
            const response = await request(app).get("/api/sessions/unprotectedCurrent").set("Cookie", cookie)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
            expect(response.body.payload.email).toBe(mockUser.email)
        })

        it("Deberia fallar si no hay token", async () => {
            const response = await request(app).get("/api/sessions/unprotectedCurrent")
            expect(response.statusCode).toBe(401)
            expect(response.body.status).toBe("error")
            expect(response.body.message).toBe("No token provided")
        })
    })


    afterAll(async () => {
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.close();
    });
})