import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'
import { Question, QuestionSurvey } from '../models/question.model';
import prisma from '../prisma/prismaClient';

/**
 * @api {get} /survey/ Get all surveys
 * @apiName getSurveys
 * @apiGroup Survey
 * @apiDescription Get all surveys.
 * @apiSuccess (200) {Object[]} users An array of surveys.
 */
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

/**
 * @api {get} /survey/user/:id Get user's surveys
 * @apiName getSurveysByUser
 * @apiParam {Number} id User id
 * @apiGroup Survey
 * @apiDescription Get the surveys of the user provided.
 * @apiSuccess (200) {String} id Id of the question.
 * @apiSuccess (200) {String} title Title of the question.
 * @apiSuccess (200) {String} resource Resource of the question.
 * @apiSuccess (200) {Object[]} questionsSurvey Questions of the survey.
 * @apiSuccess (200) {Number} user_creator_id Id of the creator of the question.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {get} /survey/:id Get survey by id
 * @apiName getSurveyById
 * @apiParam {Number} id Survey id
 * @apiGroup Survey
 * @apiDescription Get the survey giving its id.
 * @apiSuccess (200) {String} id Id of the question.
 * @apiSuccess (200) {String} title Title of the question.
 * @apiSuccess (200) {String} resource Resource of the question.
 * @apiSuccess (200) {Object[]} questionsSurvey Questions of the survey.
 * @apiSuccess (200) {Number} user_creator_id Id of the creator of the question.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (500) Error Prisma error.
 */
const getSurveyById = async (req: Request, res: Response): Promise<Response> => {
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

/**
 * @api {post} /survey Create survey
 * @apiName createSurvey()
 * @apiBody {String} title Title of the survey.
 * @apiBody {String} resource Resource of the question.
 * @apiBody {Object[]} questions Questions of the survey.
 * @apiBody {Number} user_creator_id Id of the creator of the question.
 * @apiGroup Survey
 * @apiDescription Create a new survey
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) UserNotFound The user creator does not exists.
 * @apiError (500) QuestionsMissing You must provide questions.
 * @apiError (500) FieldMissing You must provide all fields.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {get} /survey/courses/:id GetSurveysByCourse
 * @apiName getSurveysByCourse()
 * @apiParam {Number} id The id of the course.
 * @apiGroup Survey
 * @apiDescription Get all course's surveys.
 * @apiSuccess (200) {Object[]} surveys An array with the surveys retrieved.
 * @apiError (400) InvalidId You must provide a course valid id.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {put} /survey UpdateUser
 * @apiName updateSurvey()
 * @apiBody {String} id Id of the survey.
 * @apiBody {String} title Title of the survey.
 * @apiBody {Object[]} questions Questions of the survey.
 * @apiBody {String} resource Resource of the survey.
 * @apiGroup Survey
 * @apiDescription Update a survey
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) SurveyNotFound The survey does not exists.
 * @apiError (500) EmptyQuestion The question must have questions.
 * @apiError (500) FieldMissing You must provide all requiered fields.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {delete} /survey/:id DeleteSurvey
 * @apiName deleteSurvey()
 * @apiParam {Number} id Id of the survey.
 * @apiGroup Survey
 * @apiDescription Delete a survey
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidId The survey id must be valid.
 * @apiError (400) SurveyPlayed The survey has been played and it cannot be deleted.
 * @apiError (404) SurveyNotFound The survey does not exists.
 * @apiError (500) Error Prisma error.
 */
const deleteSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de cuestionario válido" })
        }
        const survey = await prisma.survey.findFirst({
            where: { id: Number(req.params.id)},
            select: {
                game: true
            }
        })
        if(!survey) {
            return res.status(404).json({message: "El cuestionario especificado no existe"})
        }
        if(survey?.game.length > 0)
            return res.status(400).json({message: "El cuestionario ha sido jugado y no se puede eliminar"})
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

/**
 * @api {delete} /survey/:survey_id/course/:course_id DeleteSurveyFromCourse
 * @apiName deleteSurveyFromCourse()
 * @apiParam {Number} survey_id The id of the survey.
 * @apiParam {Number} course_id The id of the course.
 * @apiGroup Survey
 * @apiDescription Deletes a survey from course.
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidSurveyId Invalid survey id.
 * @apiError (400) InvalidCourseId Invalid course id.
 * @apiError (404) SurveyNotFound The question does not exists.
 * @apiError (404) CourseNotFound The course does not exists.
 * @apiError (500) Error Prisma error.
 */
const deleteSurveyFromCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.survey_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de pregunta válido" })
        }
        if (!req.params.course_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const course = await prisma.course.findUnique({ where: { id: Number(req.params.course_id) } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        const survey = await prisma.survey.findUnique({ where: { id: Number(req.params.survey_id) } })
        if (!survey)
            return res.status(404).json({ message: "El cuestionario especificado no existe" })
        
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
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    deleteSurveyFromCourse
}