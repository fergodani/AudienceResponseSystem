import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'
import multiparty = require('multiparty');
import { parseFile } from 'fast-csv'
import { Role, User } from '../models/user.model';
import nodemailer from "nodemailer";
import prisma from '../prisma/prismaClient';
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const passGenerator = require('generate-password');
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los usuarios" })
    }
}

const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        let result = await prisma.user.findFirst({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                username: true,
                role: true
            }
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener el usuario" })
    }
}

const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, role } = req.body;
        const usernameUpperCase = username.toUpperCase()
        const existingUser = await prisma.user.findUnique({
            where: {
                username: usernameUpperCase,
            },
        })

        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        let password = passGenerator.generate({
            length: 10,
            numbers: true
        })
        if(req.body.password)
            password = req.body.password
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        let savedUser: Prisma.userCreateInput
        savedUser = {
            username: usernameUpperCase,
            password: hash,
            role: role,
        }
        await prisma.user.create({ data: savedUser })
        await sendEmail(usernameUpperCase, password)
        return res.status(200).json({ message: "Usuario creado correctamente" });

    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al crear el usuario" })
    }
};

async function sendEmail(username: string, password: string) {
    try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: username + "@uniovi.es",
        subject: 'Acceso a la aplicación Audience Response System',
        html: '<p>Para acceder a la aplicación, usa las siguientes credenciales:</p>'
        + '<p>Usuario: ' + username + "</p>"
        + '<p>Contraseña: ' + password + '</p>',
      };
  
    await transport.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const usernameUpperCase = req.body.username.toUpperCase()
        const user = await prisma.user.findFirst({
            where: {
                username: usernameUpperCase,
            },
        })
        
        if (user == null) {
            return res.status(404).json({ message: "Usuario o contraseña incorrectos" });
        }

        const success = await bcrypt.compare(req.body.password, user.password);
        if (!success) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const userId = user.id;
        const token = jwt.sign({ userId }, process.env.SECRET);
        return res.status(200).json({
            id: userId,
            username: user.username,
            password: user.password,
            role: user.role,
            roleType: getRole(user.role),
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al iniciar sesión" })
    }
};

function getRole(role: string): Role {
    switch (role) {
        case 'student': {
            return Role.Student;
        }
        case 'professor': {
            return Role.Professor
        }
        default: {
            return Role.Admin;
        }
    }
}

const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, username, password, role } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
        })
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const newUsername = username != "" ? username : user.username;
        const newRole = role != "" ? role : user.role;
        const newPassword = password != undefined ? password : ""
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                username: newUsername.toUpperCase(),
                password: newPassword != '' ? hash : undefined,
                role: newRole
            }
        })
        return res.status(200).json({ message: "Usuario modificado correctamente" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al modificar el usuario" })
    }
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await prisma.user.delete({
            where: {
                id: Number(req.params.id)
            },
        })
        return res.status(200).json({ message: "Usuario eliminado correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el usuario" })
    }
}

const importUsers = async (req: Request, res: Response) => {
    return new Promise(function (resolve, reject) {
        const form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            const users: User[] = []
            parseFile(files.file[0].path, { headers: true })
                .on('error', error => {
                    res.status(500).json({ message: "Ha ocurrido un error al importar los usuarios" })
                })
                .on('data', row => {
                    users.push(row)
                })
                .on('end', (rowCount: number) => {
                    if (rowCount == 0) {
                        res.status(500).json({ message: "El fichero no puede estar vacío" })
                    }

                    (async () => {
                        await addUsers(res, users)
                        resolve(res)
                    })();

                });
        });
    })

}

async function addUsers(res: Response, users: User[]) {
    try {
        // TODO: generar contraseña aleatoria
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash("3456g243bv5", salt);
        let usersPrisma: Prisma.userCreateInput[] = []
        let hasMissingFields = false
        users.forEach(user => {
            if (user.username == "" || user.role == "")
                hasMissingFields = true
            user.password = hash
            usersPrisma.push({
                username: user.username,
                password: hash,
                role: getRole(user.role)
            })
        })
        if (!hasMissingFields) {
            await prisma.user.createMany({ data: usersPrisma })
            res.status(200).json({ message: "Usuarios creados correctamente" })
        } else {
            res.status(500).json({ message: "No puede haber campos vacíos" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Ha ocurrido un error al importar los usuarios" })
    }
}

const getUsersByCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const userCourses = await prisma.userCourse.findMany({
            where: {
                course_id: Number(req.params.id)
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true
                    }
                }
            }
        })
        const users = userCourses.map((user: any) => user.user)
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los usuarios" })
    }
}

const changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.params.id),
            },
        })
        if (user == null) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const success = await bcrypt.compare(req.body.actualPassword, user.password);
        console.log(success)
        if (!success) {
            return res.status(400).json({ message: "Credencial inválida" });
        }

        const newPassword = req.body.newPassword;
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                password: hash
            }
        })
        return res.status(200).json({ message: "La contraseña se ha actualizado correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al modificar la contraseña" })
    }
}

const deleteUserFromCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.user_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        if (!req.params.course_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const user = await prisma.user.findUnique({ where: { id: Number(req.params.user_id) } })
        if (!user)
            return res.status(404).json({ message: "El usuario especificado no existe" })
        const course = await prisma.course.findUnique({ where: { id: Number(req.params.course_id) } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        await prisma.userCourse.delete({
            where: {
                user_id_course_id: {
                    course_id: Number(req.params.course_id),
                    user_id: Number(req.params.user_id)
                }
            }
        })
        return res.status(200).json({ message: "Usuario eliminado del curso correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el usuario del curso" })
    }
}

module.exports = {
    getUsers,
    login,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    importUsers,
    getUsersByCourse,
    changePassword,
    deleteUserFromCourse
}