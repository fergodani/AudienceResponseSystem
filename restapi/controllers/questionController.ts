import { Request, Response } from 'express';
import { Prisma, PrismaClient, type } from '@prisma/client'
const prisma = new PrismaClient()

const getQuestions = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.question.findMany({
            include: {
                answer: true,
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { description, subject, type, answer_time, answers, resource } = req.body;
        console.log(req.body)
        let savedQuestion: Prisma.questionCreateInput
        savedQuestion = {
            description,
            subject,
            type: type as type,
            answer_time,
            resource,
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