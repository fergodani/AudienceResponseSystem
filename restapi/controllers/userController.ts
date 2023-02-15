import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient()

const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.user.findMany();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password, role } = req.body;
        const existingUser = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })

        if (existingUser) {
            return res.status(400).send("Ya existe un usuario con ese email");
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        let savedUser: Prisma.userCreateInput
        savedUser = {
            username: username,
            password: hash,
            role: role,
        }
        await prisma.user.create({ data: savedUser })
        
        const token = jwt.sign({ user: savedUser }, process.env.SECRET);

        return res.status(200).json({ token });

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
};



const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username,
            },
        })
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        const success = await bcrypt.compare(req.body.password, user.password);

        if (!success) {
            return res.status(400).send("Credenciales inválidas");
        }
        const token = jwt.sign({ user }, process.env.SECRET);
        return res.status(200).json({
            token
        });
    } catch (error) {
        return res.status(500)
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser
}