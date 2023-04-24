import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import { Question, QuestionSurvey } from '../models/question.model';
const prisma = new PrismaClient()

const getSurveys = async (req: Request, res: Response): Promise<Response> => {
    try{
        // igual no es necesario que busque las respuestas, o si
        let result = await prisma.survey.findMany({
            include: {
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
        return res.status(500).send(error)
    }
}

// Cuestionarios dado su creador
const getSurveysByUser = async (req: Request, res: Response): Promise<Response> => {
    try{
        let user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        let result = await prisma.survey.findMany({
            where: {
                user
            },
            include: {
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
        return res.status(500).send(error)
    }
}

const getSurveysById = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.survey.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
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
        return res.status(500).send(error)
    }
}

const createSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, user_creator_id, questions, resource } = req.body;
        //let questionIds = <Question[]>questions.map((question: Question)  => ({ id: question.id }))
        const user = await prisma.user.findUnique({
            where: {
                id: user_creator_id,
            },
        })
        if (!user){
            return res.status(400).json({message: "The user who is creating question does not exists"})
        }
        let savedSurvey: Prisma.surveyCreateInput;
        savedSurvey = {
            title,
            user: {
                connect: {id: user_creator_id}
            },
            resource
        }
        
        const surveyCreated = await prisma.survey.create({ data: savedSurvey })
        const questionsWithPosition = <QuestionSurvey[]>questions.map((question:Question) => ({
            survey_id: surveyCreated.id,
            question_id: question.id,
            position: question.position
        }))
        console.log(questionsWithPosition)
        await prisma.questionSurvey.createMany({ data: questionsWithPosition })
        return res.status(200).json({message: "Survey created"})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

const getSurveysByCourse = async (req: Request, res: Response): Promise<Response> => {
    try{
       const courseSurvey = await prisma.courseSurvey.findMany({
            where: {
                course_id: Number(req.params.id)
            },
            select: {
                survey: true
            }
        })
        const survey = courseSurvey.map((survey: any) => survey.survey)
        return res.status(200).json(survey)
    } catch (error) {
        return res.status(500).send(error);
    }
}

const updateSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {id, title, questions, resource} = req.body
        const questionsWithPosition = <QuestionSurvey[]>questions.map((question:Question) => ({
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
        return res.status(200).json({message: "Cuestionario actualizado correctamente"})
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

const deleteSurvey = async (req: Request, res: Response): Promise<Response> => {
    try {
        await prisma.survey.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({message: "Cuestionario eliminado correctamente"})
    }catch(error){
        console.error(error)
        return res.status(500).send(error)
    }
}

module.exports = {
    getSurveys,
    getSurveysByUser,
    createSurvey,
    getSurveysByCourse,
    getSurveysById,
    updateSurvey,
    deleteSurvey
}