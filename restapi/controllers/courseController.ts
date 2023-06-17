import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'
import multiparty = require('multiparty');
import { parseFile } from 'fast-csv'
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Survey } from '../models/survey.model';
import { Question } from '../models/question.model';
import prisma from '../prisma/prismaClient';

const getCourses = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.course.findMany({
            select: {
                id: true,
                name: true,
                description: true
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

const getCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        let result = await prisma.course.findUnique({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                name: true,
                description: true
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const createCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description } = req.body
        const existingCourse = await prisma.course.findFirst({
            where: {
                name: name,
            },
        })
        if (existingCourse) {
            return res.status(400).json({ message: "Ya existe un curso con ese nombre" })
        }
        let savedCourse: Prisma.courseCreateInput
        savedCourse = {
            name: name,
            description: description,
        }
        await prisma.course.create({ data: savedCourse })
        return res.status(200).json({ message: "El curso ha sido creado correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al crear el curso" })
    }
}

const updateCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, name, description } = req.body
        const course = await prisma.course.findFirst({
            where: {
                id: Number(id),
            }
        })
        if (course == null) {
            return res.status(404).json({ message: "El curso especificado no existe" })
        }
        const newName = name != "" ? name : course.name;
        const newDescription = description != "" ? description : course.description;
        await prisma.course.update({
            where: {
                id: Number(id),
            },
            data: {
                name: newName,
                description: newDescription
            }
        })
        return res.status(200).json({ message: "El curso ha sido modificado correctamente" })
    } catch (error) {
        return res.status(500).send(error)
    }
}

const deleteCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const course = await prisma.course.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        if (!course) {
            return res.status(404).json({ message: "El curso especificado no ha sido encontrado" })
        }
        await prisma.course.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({ message: "El curso ha sido eliminado correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el curso" })
    }
}

const importCourses = async (req: Request, res: Response): Promise<Response> => {
    return new Promise(function (resolve, reject) {
        const form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            const courses: Course[] = []
            parseFile(files.file[0].path, { headers: true })
                .on('error', error => {
                    res.status(500).json({ message: "Ha ocurrido un erro al importar los cursos" })
                })
                .on('data', row => {
                    courses.push(row)
                })
                .on('end', (rowCount: number) => {
                    if (rowCount == 0) {
                        res.status(500).json({ message: "El fichero no puede estar vacío" })
                    }

                    (async () => {
                        await addCourses(res, courses)
                        resolve(res)
                    })();
                })
        })
    })
}

async function addCourses(res: Response, courses: Course[]) {
    try {
        let coursesPrisma: Prisma.courseCreateInput[] = []
        let hasMissingFields = false
        courses.forEach(course => {
            if (course.description == "" || course.name == "")
                hasMissingFields = true
            coursesPrisma.push({
                name: course.name,
                description: course.description
            })
        })
        if (!hasMissingFields) {
            await prisma.course.createMany({ data: coursesPrisma })
            res.status(200).json({ message: "Cursos creados correctamente" })
        } else {
            res.status(500).json({ message: "No puede haber campos vacíos" })
        }
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al importar los cursos" })
    }
}

const addUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { course_id, users } = req.body;
        if (users.length == 0)
            return res.status(500).json({ message: "Debe haber al menos un usuario" })
        const course = await prisma.course.findFirst({ where: { id: course_id } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        const users_ids = users.map((user: User) => (user.id))
        const usersSaved = await prisma.user.findMany({ where: { id: { in: users_ids } } })
        if (usersSaved.length != users.length)
            return res.status(404).json({ message: "Los usuarios especificados no existen" })
        const userCourses = users.map((user: User) => ({ course_id, user_id: user.id }))
        await prisma.userCourse.createMany({
            data: userCourses
        })
        return res.status(200).json({ message: "Los usuarios han sido añadidos correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al añadir los usuarios al curso" });
    }
}

const addSurveys = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { course_id, surveys } = req.body;
        if (surveys.length == 0)
            return res.status(500).json({ message: "Debe haber al menos un cuestionario" })
        const course = await prisma.course.findFirst({ where: { id: course_id } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        const surveys_ids = surveys.map((survey: Survey) => (survey.id))
        const surveysSaved = await prisma.survey.findMany({ where: { id: { in: surveys_ids } } })
        if (surveysSaved.length != surveys_ids.length)
            return res.status(404).json({ message: "Los cuestionarios especificados no existen" })
        const courseSurvey = surveys.map((survey: Survey) => ({ course_id, survey_id: survey.id }))
        await prisma.courseSurvey.createMany({
            data: courseSurvey
        })
        return res.status(200).json({ message: "Los cuestionarios han sido añadidos correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al añadir los cuestionarios al curso" });
    }
}

const addQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { course_id, questions } = req.body;
        if (questions.length == 0)
            return res.status(500).json({ message: "Debe haber al menos una pregunta" })
        const course = await prisma.course.findFirst({ where: { id: course_id } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        const questions_ids = questions.map((question: Question) => (question.id))
        const questionsSaved = await prisma.question.findMany({ where: { id: { in: questions_ids } } })
        if (questionsSaved.length != questions_ids.length)
            return res.status(404).json({ message: "Las preguntas especificadas no existen" })
        const questionSurvey = questions.map((question: Question) => ({ course_id, question_id: question.id }))
        await prisma.courseQuestion.createMany({
            data: questionSurvey
        })
        return res.status(200).json({ message: "Las preguntas han sido añadidas correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al añadir las preguntas al curso" });
    }
}

const getCoursesByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const userCourses = await prisma.userCourse.findMany({
            where: {
                user_id: Number(req.params.id)
            },
            select: {
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        })
        const courses = userCourses.map((course: any) => course.course)
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    importCourses,
    addUsers,
    addSurveys,
    getCoursesByUser,
    addQuestions
}