import { Request, Response } from 'express';
import { Prisma, PrismaClient, type } from '@prisma/client'
import { Answer } from '../models/answer.model';
const prisma = new PrismaClient()

const getQuestions = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.question.findMany();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { description, subject, type, answer_time, answers } = req.body;
        console.log(req.body)
        let savedQuestion: Prisma.questionCreateInput
        savedQuestion = {
            description,
            subject,
            type: type as type,
            answer_time,
            answer: {
                createMany: {
                    data: answers
                }
            }
        }
        await prisma.question.create({ data: savedQuestion })
        return res.status(200).json({ message: "Question created" });
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}


module.exports = {
    getQuestions,
    createQuestion
}