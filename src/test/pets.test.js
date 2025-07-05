import request from "supertest"
import mongoose from "mongoose"
import app from "../../app.js"
import dotenv from "dotenv"
import path from "path"
dotenv.config();

const MONGO_URL_TEST = process.env.MONGO_URL

describe("GET /api/pets/", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
    });

    it("Deberia devolver todos las mascotas de la base de datos", async () => {
        await request(app).post("/api/pets").send({
            name: "garfield",
            specie: "cat",
            birthDate: "2003-05-07"
        })
        const response = await request(app).get(`/api/pets`)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        expect(Array.isArray(response.body.payload)).toBe(true)
        expect(response.body.payload.length).toBeGreaterThan(0)
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})

describe("POST /api/pets/", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
    });

    it("Deberia crear un pet en la base de datos", async () => {
        const response = await request(app).post("/api/pets")
            .send({
                name: "fisu",
                specie: "dog",
                birthDate: "2000-07-02"
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("success")
        expect(response.body.payload).toHaveProperty("_id")
        expect(response.body.payload.name).toBe("fisu")
    })

    it("Deberia devolver error 400 si falta algun dato", async () => {
        const response = await request(app).post("/api/pets")
            .send({ name: "pepe" })
        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("Incomplete values or invalid values")
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})

describe("POST /api/pets/withimage", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
    });

    it("Deberia crear un pet con imagen en la base de datos", async () => {
        const filePath = path.join(process.cwd(), "public", "img", "test-img.jpg")

        const response = await request(app)
            .post("/api/pets/withimage")
            .field("name", "carlitos")
            .field("specie", "cat")
            .field("birthDate", "2021-05-01")
            .attach("image", filePath)

        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("success")
        expect(response.body.payload).toHaveProperty("image")
    })

    it("Deberia devolver error 400 si falta algun dato", async () => {
        const response = await request(app).post("/api/pets/withimage")
            .send({ name: "juancito" })
        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("Incomplete values or missing file")
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})


describe("PUT y DELETE /api/pets:pid", () => {
    let petId

    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST)
    })

    beforeEach(async () => {
        await mongoose.connection.db.collection("pets").deleteMany({})

        const res = await request(app).post("/api/pets")
            .send({
                name: "pepito",
                specie: "dog",
                birthDate: "2002-05-03"
            })

        petId = res.body.payload._id
    })

    it("Deberia actualizar la mascota correctamente", async () => {
        const response = await request(app).put(`/api/pets/${petId}`)
            .send({ name: "carlitos" })

        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })

    it("Deberia volver 404 si el pet no existe o el body esta mal", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString()
            const response = await request(app).put(`/api/pets/${fakeId}`)
            .send({ name: "jorge" })

            expect(response.statusCode).toBe(404)
            expect(response.body.status).toBe("error")
            expect(response.body.error).toMatch(/not found/i)
    })


    afterAll(async () => {

        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})


