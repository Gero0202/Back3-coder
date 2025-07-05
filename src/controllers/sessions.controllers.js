import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import logger from "../utils/logger.js";

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || typeof first_name !== "string" || !last_name || typeof last_name !== "string" ||
            typeof email !== "string" || !email || typeof password !== "string" || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values or invalid values" });
        }
        const exists = await usersService.getUserByEmail(email);

        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        logger.info(result)
        
        res.status(201).send({ status: "success", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

        const user = await usersService.getUserByEmail(email);

        if (!user) return res.status(404).send({ status: "error", error: "User do not exist" });

        const isValidPassword = await passwordValidation(user, password);

        if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });

        const userDto = UserDTO.getUserTokenFrom(user);

        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

        res.status(200).cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" })
    }

}

const current = async (req, res) => {
    try {
        const cookie = req.cookies['coderCookie']

        if (!cookie) {
            return res.status(401).send({ status: "error", message: "No token provided" })
        }
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        return res.status(200).send({ status: "success", payload: user })
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
}

const unprotectedLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User do not exist" });

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) return res.status(401).send({ status: "error", error: "Incorrect password" });

        const { _id, first_name, last_name } = user;
        const tokenPayload = { _id, first_name, last_name, email };
        const token = jwt.sign(tokenPayload, 'tokenSecretJWT', { expiresIn: "1h" });

        res.status(200).cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
    } catch (error) {
        return res.status(500).send({ status: "error", error: "Internal server error" })
    }
}

const unprotectedCurrent = async (req, res) => {
    try {
        const cookie = req.cookies['unprotectedCookie']

        if (!cookie) {
            return res.status(401).send({ status: "error", message: "No token provided" })
        }

        const user = jwt.verify(cookie, 'tokenSecretJWT');

        return res.status(200).send({ status: "success", payload: user })
    } catch (error) {
        return res.status(401).send({ status: "error", message: "Invalid or expired token" })
    }
}

export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}