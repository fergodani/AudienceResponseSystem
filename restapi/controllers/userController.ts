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

const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.user.findFirst({
            where: {
                id: Number(req.params.id),
            },
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send(error);
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
            return res.status(400).send("User already exists");
        }
        // TODO: generar contraseña aleatoria
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        let savedUser: Prisma.userCreateInput
        savedUser = {
            username: username,
            password: hash,
            role: role,
        }
        await prisma.user.create({ data: savedUser })

        return res.status(200).json({ message: "User created" });

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
};



const login = async (req: Request, res: Response): Promise<Response> => {
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
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({ user }, process.env.SECRET);

        return res.status(200).json({
            token
        });
    } catch (error) {
        return res.status(500)
    }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.body)
        const { id, username, password, role } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
        })
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        const newUsername = username != "" ? username : user.username;
        const newRole = role != "" ? role : user.role;
        if (password != "") {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            await prisma.user.update({
                where: {
                    id: Number(id),
                },
                data: {
                    username: newUsername,
                    password: hash,
                    role: newRole
                }
            })
            return res.status(200).json({ message: req.body.username + " updated." })
        } else {
            await prisma.user.update({
                where: {
                    id: Number(id),
                },
                data: {
                    username: newUsername,
                    role: newRole
                }
            })
            return res.status(200).json({ message: req.body.username + " updated." })
        }
    } catch (error) {
        console.log("The user can't be updated")
        return res.status(500).json({ message: error })
    }
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        await prisma.user.delete({
            where: {
                id: Number(req.params.id)
            },
        })
        return res.status(200).json({ message: req.params.id + " user deleted" })
    } catch (error) {
        return res.status(500)
    }
}

module.exports = {
    getUsers,
    login,
    createUser,
    updateUser,
    deleteUser,
    getUser
}