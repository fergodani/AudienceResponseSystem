import { Request, Response } from 'express';
import { Prisma, PrismaClient, type } from '@prisma/client'
import { Options, parse, transforms } from 'json2csv'
import { Question, QuestionCsv } from '../models/question.model';
import { Answer } from '../models/answer.model';
const { flatten, unwind } = transforms;


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
        // Mapear las preguntas para formar el json necesario
        let questionsCsv: QuestionCsv[] = result.map((question) => (
            {
                descripcion: question.description,
                tema: question.subject,
                tipo: question.type,
                tiempo: question.answer_time,
                respuesta1: question.answers[0].description,
                correcta1: question.answers[0].is_correct,
                respuesta2: question.answers.length >= 2 ? question.answers[1].description : undefined,
                correcta2: question.answers.length >= 2 ? question.answers[1].is_correct : undefined,
                respuesta3: question.answers.length >= 3 ? question.answers[2].description : undefined,
                correcta3: question.answers.length >= 3 ? question.answers[2].is_correct : undefined,
                respuesta4: question.answers.length >= 4 ? question.answers[3].description : undefined,
                correcta4: question.answers.length >= 4 ? question.answers[3].is_correct : undefined,
            }
        ))
        const option: Options<QuestionCsv> = {quote: 'SDFAG'}
        const csv = parse(questionsCsv, option)
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

function stringFormatter(arg0: { quote: string; }) {
    throw new Error('Function not implemented.');
}
