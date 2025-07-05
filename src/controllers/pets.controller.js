import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import logger from "../utils/logger.js"

const getAllPets = async (req, res) => {
    try {
        const pets = await petsService.getAll();
        res.status(200).send({ status: "success", payload: pets })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const createPet = async (req, res) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || typeof name !== "string" || !specie || typeof specie !== "string" || !birthDate || typeof birthDate !== "string") {
            return res.status(400).send({ status: "error", error: "Incomplete values or invalid values" })
        }
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);

        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const updatePet = async (req, res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;

        const result = await petsService.update(petId, petUpdateBody);
        if (!result) return res.status(404).send({ status: "error", error: "Pet not found" })

        res.status(200).send({ status: "success", message: "pet updated" })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const deletePet = async (req, res) => {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);

        if (!result) return res.status(404).send({ status: "error", error: "Pet not found" })

        res.status(200).send({ status: "success", message: "pet deleted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const createPetWithImage = async (req, res) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;

        if (!name || typeof name !== "string" || !specie || typeof specie !== "string" || !birthDate || typeof birthDate !== "string") {
            return res.status(400).send({ status: "error", error: "Incomplete values or missing file" })
        }
        logger.info(file)
        

        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `/img/${file.filename}`
            
        });
        logger.info(pet)
        

        const result = await petsService.create(pet);
        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}