import { Request, Response } from 'express';
import { Prisma, PrismaClient, role } from '@prisma/client'
import multiparty = require('multiparty');
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import * as csv_format from '@fast-csv/format';
import { User } from '../models/user.model';
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
        return res.status(500).send(error)
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
        return res.status(500).send(error)
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
        return res.status(500).send(error)
    }
}

const uploadUserFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const form = new multiparty.Form({ uploadDir: '../restapi/files' });
        form.parse(req, function (err, fields, files) {
            fs.rename(files.file[0].path, process.env.FILEPATH!, function (err) {
                if (err) console.log('ERROR: ' + err);
            });
            fs.createReadStream(path.resolve(process.env.FILEPATH!))
                .pipe(csv.parse({ headers: true }))
                .on('error', error => console.error(error))
                .on('data', row => {
                    addUser(row)
                })
                .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
        });

        return res.status(200).json({ message: "File read successful" })
    } catch (error) {
        return res.status(500).send(error)
    }
}

async function addUser(user: User) {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: user.username,
            },
        })

        if (existingUser) {
            return;
        }
        // TODO: generar contraseña aleatoria
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash("3456g243bv5", salt);
        let savedUser: Prisma.userCreateInput
        savedUser = {
            username: user.username,
            password: hash,
            role: user.role as role,
        }
        await prisma.user.create({ data: savedUser })


    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getUsers,
    login,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    uploadUserFile
}