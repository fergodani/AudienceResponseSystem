import { Request, Response } from 'express';
import { Prisma, role } from '@prisma/client'
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

/**
 * @api {get} /user/ Get all users
 * @apiName getUsers
 * @apiGroup User
 * @apiDescription Get all users except the admin.
 * @apiSuccess (200) {Object[]} users An array of users.
 */
const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.user.findMany({
            where: {
                NOT: {
                    role: role.admin
                }
            },
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

/**
 * @api {get} /user/:id Get user
 * @apiName getUser
 * @apiParam {Number} id User id
 * @apiGroup User
 * @apiDescription Get the user with the id provided
 * @apiSuccess (200) {String} id Id of the user.
 * @apiSuccess (200) {String} username Username of the user.
 * @apiSuccess (200) {String} role Role of the user.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {post} /user/create Create user
 * @apiName createUser()
 * @apiBody {String} username Username of the user
 * @apiBody {String} role Role of the user
 * @apiGroup User
 * @apiDescription Create a new user
 * @apiUse SendEmail
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) UserAlreadyExists The user already exists.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @apiDefine SendEmail
 * @apiName sendEmail()
 * @apiDescription Sends credentials to the new user.
 */
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

/**
 * @api {post} /user/login Login
 * @apiName login()
 * @apiBody {String} username Username of the user
 * @apiBody {String} password Password of the user
 * @apiGroup User
 * @apiDescription Login a user
 * @apiSuccess (200) {Number} id Id of the user.
 * @apiSuccess (200) {String} username Username of the user.
 * @apiSuccess (200) {String} role Role of the user.
 * @apiSuccess (200) {String} token Token of the user.
 * @apiError (400) InvalidCredential Invalid user or password.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {put} /user UpdateUser
 * @apiName updateUser()
 * @apiBody {Number} id Id of the user
 * @apiBody {String} username Username of the user
 * @apiBody {String} password Password of the user
 * @apiBody {String} role Role of the user
 * @apiGroup User
 * @apiDescription Update a user
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) UserNotFound The user does not exists.
 * @apiError (500) Error Prisma error.
 */
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
        const newPassword = password ?? ""
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

/**
 * @api {delete} /user/:id DeleteUser
 * @apiName deleteUser()
 * @apiParam {Number} id Id of the user.
 * @apiGroup User
 * @apiDescription Delete a user
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidId The user id must be valid.
 * @apiError (404) UserNotFound The user does not exists.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {post} /user/file ImportUsers
 * @apiName importUsers()
 * @apiBody {Object} FormData FormData with the csv.
 * @apiGroup User
 * @apiDescription Import users using a csv.
 * @apiUse AddUsers
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (500) Error Prisma error.
 * @apiError (500) EmptyFile The file cannot be empty.
 */
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

/**
 * @apiDefine AddUsers
 * @apiName AddUsers()
 * @apiDescription Create all the users given.
 */
async function addUsers(res: Response, users: User[]) {
    try {
        let password = passGenerator.generate({
            length: 10,
            numbers: true
        })
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
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

/**
 * @api {get} /user/courses/:id GetUsersByCourse
 * @apiName getUsersByCourse()
 * @apiParam {Number} id The id of the course.
 * @apiGroup User
 * @apiDescription Get all course's users.
 * @apiSuccess (200) {Object[]} users An array with the users retrieved.
 * @apiError (400) InvalidId You must provide a course valid id.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {put} /user/password/:id ChangePassword
 * @apiName changePassword()
 * @apiParam {Number} id The id of the user.
 * @apiGroup User
 * @apiDescription Change the password of the user given.
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) UserNotFound The user does not exists.
 * @apiError (400) InvalidCredentials The credentials are invalid.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {delete} /user/:user_id/course/:course_id DeleteUserFromCourse
 * @apiName deleteUserFromCourse()
 * @apiParam {Number} user_id The id of the user.
 * @apiParam {Number} course_id The id of the course.
 * @apiGroup User
 * @apiDescription Deletes a user from course.
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidUserId Invalid user id.
 * @apiError (400) InvalidCourseId Invalid course id.
 * @apiError (404) UserNotFound The user does not exists.
 * @apiError (404) CourseNotFound The course does not exists.
 * @apiError (500) Error Prisma error.
 */
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