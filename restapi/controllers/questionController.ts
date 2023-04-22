import { Request, Response } from 'express';
import { Prisma, PrismaClient, type } from '@prisma/client'
import { Options, parse, transforms } from 'json2csv'
import { Question, QuestionCsv } from '../models/question.model';
import multiparty = require('multiparty');
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { Answer } from '../models/answer.model';


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
                correcta1: question.answers[0].is_correct.toString(),
                respuesta2: question.answers.length >= 2 ? question.answers[1].description : undefined,
                correcta2: question.answers.length >= 2 ? question.answers[1].is_correct.toString() : undefined,
                respuesta3: question.answers.length >= 3 ? question.answers[2].description : undefined,
                correcta3: question.answers.length >= 3 ? question.answers[2].is_correct.toString() : undefined,
                respuesta4: question.answers.length >= 4 ? question.answers[3].description : undefined,
                correcta4: question.answers.length >= 4 ? question.answers[3].is_correct.toString() : undefined,
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

const importQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const form = new multiparty.Form({uploadDir: '../restapi/files'})
        form.parse(req, function (err, fields, files) {
            fs.rename(files.file[0].path, process.env.FILEPATH!, function (err) {
                if (err) console.log('ERROR: ' + err);
            });
            fs.createReadStream(path.resolve(process.env.FILEPATH!))
                .pipe(csv.parse({ headers: true }))
                .on('error', error => console.error(error))
                .on('data', row => {
                    addQuestion(row, Number(req.params.id))
                })
                .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
        });
        return res.status(200).json({message: "Preguntas importadas correctamente"});
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

async function addQuestion(question: QuestionCsv, user_id: number) {
    let answers: Answer[] = []
    answers.push({description: question.respuesta1, is_correct: question.correcta1 === 'true'})
    if (question.respuesta2 != undefined) answers.push({description: question.respuesta2, is_correct: question.correcta2!! === 'true'})
    if (question.respuesta3 != undefined) answers.push({description: question.respuesta3, is_correct: question.correcta3!! === 'true'})
    if (question.respuesta4 != undefined) answers.push({description: question.respuesta4, is_correct: question.correcta4!! === 'true'})
    let savedQuestion: Prisma.questionCreateInput
        savedQuestion = {
            description: question.descripcion,
            subject: question.tema,
            type: question.tipo as type,
            answer_time: Number(question.tiempo),
            user: {
                connect: { id:  user_id}
            },
            answers: {
                createMany: {
                    data: answers
                }
            }
        }
        await prisma.question.create({ data: savedQuestion })
}


module.exports = {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions
}
