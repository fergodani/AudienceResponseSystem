import { Request, Response } from 'express';
import { Prisma, PrismaClient, type } from '@prisma/client'
import { parse } from 'json2csv'


const prisma = new PrismaClient()

const getQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.question.findMany({
            include: {
                answers: true,
            }
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const getQuestionsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            }
        })
        let result = await prisma.question.findMany({
            where: {
                user
            },
            include: {
                answers: true,
            }
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { description, subject, type, answer_time, answers, resource, user_creator_id } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: user_creator_id,
            },
        })

        if (!user) {
            return res.status(400).json({ message: "The user who is creating question does not exists" })
        }
        let savedQuestion: Prisma.questionCreateInput
        savedQuestion = {
            description,
            subject,
            type: type as type,
            answer_time,
            resource,
            user: {
                connect: { id: user_creator_id }
            },
            answers: {
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

const exportQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            }
        })
        let result = await prisma.question.findMany({
            where: {
                user
            },
            include: {
                answers: true,
            }
        })
        const csv = parse(result)
        console.log(csv)
        return res.status(200).json(csv);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}


module.exports = {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions
}