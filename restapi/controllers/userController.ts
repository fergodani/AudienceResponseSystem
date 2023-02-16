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
            return res.status(400).send("User already exists");
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
        const { username, newUsername, newPassword, newRole } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username,
            },
        })
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        if (newPassword) {
            const isSamePassword = await bcrypt.compare(req.body.password, user.password);
            if (isSamePassword) {
                return res.status(404).json({ message: "The passwords are the same" });
            }
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(newPassword, salt);
            await prisma.user.update({
                where: {
                    username: username,
                },
                data: {
                    username: newUsername,
                    password: hash,
                    role: newRole
                }
            })
        } else {
            await prisma.user.update({
                where: {
                    username: username,
                },
                data: {
                    username: newUsername,
                    role: newRole
                }
            })
        }
        return res.status(200)
    } catch (error) {
        return res.status(500)
    }
}

const deleteUser = async (req:Request, res: Response): Promise<Response> => {
    try{
        await prisma.user.deleteMany({
            where: {
              username: {
                contains: req.body.username,
              },
            },
          })
        return res.status(200).json({message : req.body.username + " deleted"})
    } catch(error) {
        return res.status(500)
    }
}

module.exports = {
    getUsers,
    login,
    createUser,
    updateUser,
    deleteUser
}