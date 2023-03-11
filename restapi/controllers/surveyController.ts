import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import { Question } from '../models/question.model';
const prisma = new PrismaClient()

const getSurveys = async (req: Request, res: Response): Promise<Response> => {
    try{
        // igual no es necesario que busque las respuestas, o si
        let result = await prisma.survey.findMany({
            include: {
                questions: {
                    include: {
                        answers: true
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
        let questionIds = <Question[]>questions.map((question: Question)  => ({ id: question.id }))
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
            questions: {
                connect: questionIds,
            },
            resource
        }
        await prisma.survey.create({ data: savedSurvey })
        return res.status(200).json({message: "Survey created"})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports = {
    getSurveys,
    createSurvey
}