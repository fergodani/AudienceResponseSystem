import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'
import { Question, QuestionSurvey } from '../models/question.model';
import prisma from '../prisma/prismaClient';

const getSurveys = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.survey.findMany({
            select: {
                id: true,
                title: true,
                user_creator_id: true,
                questionsSurvey: {
                    include: {
                        question: {
                            include: {
                                answers: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los cuestionarios" })
    }
}

// Cuestionarios dado su creador
const getSurveysByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        let user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        let result = await prisma.survey.findMany({
            where: {
                user
            },
            select: {
                id: true,
                resource: true,
                title: true,
                user_creator_id: true,
                questionsSurvey: {
                    include: {
                        question: {
                            include: {
                                answers: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los cuestionarios" })
    }
}

const getSurveysById = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de cuestionario válido" })
        }
        let result = await prisma.survey.findUnique({
            where: {
                id: Number(req.params.id)
            },
            select: {
                id: true,
                resource: true,
                title: true,
                user_creator_id: true,
                questionsSurvey: {
                    include: {
                        question: {
                            include: {
                                answers: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los cuestionarios" })
    }
}

const createSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, user_creator_id, questions, resource } = req.body;

        if (!title || !user_creator_id || !questions) {
            return res.status(500).json({ message: "Se deben proporcionar todos los camos requeridos" })
        }

        if (questions.length == 0) {
            res.status(500).json({ message: "El cuestionario debe tener al menos una pregunta" })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: user_creator_id,
            },
        })
        if (!user) {
            return res.status(404).json({ message: "El usuario especificado no existe" })
        }
        let savedSurvey: Prisma.surveyCreateInput;
        savedSurvey = {
            title,
            user: {
                connect: { id: user_creator_id }
            },
            resource
        }

        const surveyCreated = await prisma.survey.create({ data: savedSurvey })
        const questionsWithPosition = <QuestionSurvey[]>questions.map((question: Question) => ({
            survey_id: surveyCreated.id,
            question_id: question.id,
            position: question.position
        }))

        await prisma.questionSurvey.createMany({ data: questionsWithPosition })
        return res.status(200).json({ message: "El cuestionario ha sido creado correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al crear el cuestionario" })
    }
}

const getSurveysByCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const courseSurvey = await prisma.courseSurvey.findMany({
            where: {
                course_id: Number(req.params.id)
            },
            select: {
                survey: {
                    select: {
                        id: true,
                        resource: true,
                        title: true,
                        user_creator_id: true,
                        questionsSurvey: {
                            include: {
                                question: {
                                    include: {
                                        answers: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        const survey = courseSurvey.map((survey: any) => survey.survey)
        return res.status(200).json(survey)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los cuestionarios" })
    }
}

const updateSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, title, questions, resource } = req.body
        if (!title || !questions) {
            return res.status(500).json({ message: "Se deben proporcionar todos los camos requeridos" })
        }

        if (questions.length == 0) {
            res.status(500).json({ message: "El cuestionario debe tener al menos una pregunta" })
        }

        const survey = await prisma.survey.findUnique({ where: { id: id } })
        if (!survey) {
            return res.status(404).json({ message: "El cuestionario especificado no existe" })
        }

        const questionsWithPosition = <QuestionSurvey[]>questions.map((question: Question) => ({
            survey_id: id,
            question_id: question.id,
            position: question.position
        }))
        await prisma.survey.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                resource
            }
        })
        await prisma.questionSurvey.deleteMany({
            where: {
                survey_id: Number(id)
            }
        })
        for (const question of questionsWithPosition) {
            await prisma.questionSurvey.upsert({
                where: {
                    question_id_survey_id: {
                        survey_id: Number(id),
                        question_id: Number(question.question_id)
                    }
                },
                update: {
                    position: question.position
                },
                create: {
                    survey_id: Number(id),
                    question_id: Number(question.question_id),
                    position: question.position
                }
            })
        }
        return res.status(200).json({ message: "Cuestionario actualizado correctamente" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Ha ocurrido un error al actualizar el cuestionario" })
    }
}

const deleteSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de cuestionario válido" })
        }
        const survey = await prisma.survey.findFirst({where: { id: Number(req.params.id)}})
        if(!survey) {
            res.status(404).json({message: "El cuestionario especificado no existe"})
        }
        await prisma.survey.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({ message: "Cuestionario eliminado correctamente" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el cuestionario" })
    }
}

const deleteSurveyFromCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        await prisma.courseSurvey.delete({
            where: {
                survey_id_course_id: {
                    course_id: Number(req.params.course_id),
                    survey_id: Number(req.params.survey_id)
                }
            }
        })
        return res.status(200).json({ message: "Cuestionario eliminado del curso correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el cuestionario del curso" })
    }
}

module.exports = {
    getSurveys,
    getSurveysByUser,
    createSurvey,
    getSurveysByCourse,
    getSurveysById,
    updateSurvey,
    deleteSurvey,
    deleteSurveyFromCourse
}