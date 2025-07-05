import request from "supertest"
import mongoose from "mongoose"
import app from "../../app.js"
import dotenv from "dotenv"
dotenv.config();

const MONGO_URL_TEST = process.env.MONGO_URL

describe("GET /api/adoptions/", () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
    });

    it("Deberia devolver un array con todos las adopciones (aunque este vacio)", async () => {
        const response = await request(app).get("/api/adoptions")
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        expect(Array.isArray(response.body.payload)).toBe(true)
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
        await mongoose.connection.close();
    });
})

describe("POST /api/adoptions/:uid/:pid", () => {
    let petId, userId

    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.db.collection("pets").deleteMany({});

        const userRes = await request(app).post("/api/sessions/register").send({
            first_name: "TestAdoptions",
            last_name: "UserAdoption",
            email: "testadoptions@test.com",
            password: "Chau1234",
        })

        const petRes = await request(app).post("/api/pets").send({
            name: "pepito",
            specie: "dog",
            birthDate: "2002-06-07"
        })

        userId = userRes.body.payload
        petId = petRes.body.payload._id

    });

    it("Deberia crear adopcion con user y pets validos", async () => {
        const response = await request(app).post(`/api/adoptions/${userId}/${petId}`)
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe("success")
        expect(response.body.message).toBe("Pet adopted")
    })

    it("Deberia volver error si el usuario no existe", async () => {
        const fakeUser = new mongoose.Types.ObjectId();
        const response = await request(app).post(`/api/adoptions/${fakeUser}/${petId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("user Not found")
    })

    it("Deberia volver error si el pet no existe", async () => {
        const fakePet = new mongoose.Types.ObjectId();
        const response = await request(app).post(`/api/adoptions/${userId}/${fakePet}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("Pet not found")
    })

    it("Deberia volver si la mascota ya fue adoptada", async () => {
        await request(app).post(`/api/adoptions/${userId}/${petId}`)

        const response = await request(app).post(`/api/adoptions/${userId}/${petId}`)
        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("Pet is already adopted")
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.close();
    });
})

describe("GET /api/adoptions/:aid", () => {
    let adoptionId

    beforeAll(async () => {
        await mongoose.connect(MONGO_URL_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.db.collection("users").deleteMany({});

        const userRes = await request(app).post("/api/sessions/register").send({
            first_name: "TestAdoptions",
            last_name: "UserAdoption",
            email: "testadoptions@test.com",
            password: "Chau1234",
        })

        const petRes = await request(app).post("/api/pets").send({
            name: "pepito",
            specie: "dog",
            birthDate: "2002-06-07"
        })

        
        const userId = userRes.body.payload
        const petId = petRes.body.payload._id

        const adoptionRes = await request(app).post(`/api/adoptions/${userId}/${petId}`)
        expect(adoptionRes.statusCode).toBe(201)

        const allAdoptions = await request(app).get("/api/adoptions")
        adoptionId = allAdoptions.body.payload[0]._id

    });

    it("Deberia devolver adopcion por ID de la base de datos", async () => {
        const res = await request(app).get(`/api/adoptions/${adoptionId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body.payload).toHaveProperty("owner")
        expect(res.body.payload).toHaveProperty("pet")
    })

    it("Deberia devolver error si el ID no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId()
        const response = await request(app).get(`/api/adoptions/${fakeId}`)

        expect(response.statusCode).toBe(404)
        expect(response.body.status).toBe("error")
        expect(response.body.error).toBe("Adoption not found")
    })

    afterAll(async () => {
        await mongoose.connection.db.collection("adoptions").deleteMany({});
        await mongoose.connection.db.collection("users").deleteMany({});
        await mongoose.connection.db.collection("pets").deleteMany({});
        await mongoose.connection.close();
    });
})



