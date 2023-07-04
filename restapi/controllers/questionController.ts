import { Request, Response } from 'express';
import { Prisma, type } from '@prisma/client'
import { Options, parse } from 'json2csv'
import { QuestionCsv } from '../models/question.model';
import multiparty = require('multiparty');
import { parseFile } from 'fast-csv'
import { Answer } from '../models/answer.model';
import prisma from '../prisma/prismaClient';

/**
 * @api {get} /question/ Get all questions
 * @apiName getQuestions
 * @apiGroup Question
 * @apiDescription Get all questions.
 * @apiSuccess (200) {Object[]} users An array of questions.
 */
const getQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.question.findMany({
            select: {
                id: true,
                description: true,
                subject: true,
                type: true,
                answer_time: true,
                resource: true,
                answers: true,
                user_creator_id: true
            },
        });
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

/**
 * @api {get} /question/user/:id Get user's questions
 * @apiName getQuestionsByUser
 * @apiParam {Number} id User id
 * @apiGroup Question
 * @apiDescription Get the questions of the user provided.
 * @apiSuccess (200) {String} id Id of the question.
 * @apiSuccess (200) {String} description Description of the question.
 * @apiSuccess (200) {String} subject Subject of the question.
 * @apiSuccess (200) {String} type Type of the question.
 * @apiSuccess (200) {Number} answer_time Time of the question.
 * @apiSuccess (200) {String} resource Resource of the question.
 * @apiSuccess (200) {Object[]} answers Answers of the question.
 * @apiSuccess (200) {Number} user_creator_id Id of the creator of the question.
 * @apiError (500) Error Prisma error.
 */
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
            select: {
                id: true,
                description: true,
                subject: true,
                type: true,
                answer_time: true,
                resource: true,
                answers: true,
                user_creator_id: true
            },
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

/**
 * @api {get} /question/:id Get question by id
 * @apiName getQuestionById
 * @apiParam {Number} id Question id
 * @apiGroup Question
 * @apiDescription Get the question giving its id.
 * @apiSuccess (200) {String} id Id of the question.
 * @apiSuccess (200) {String} description Description of the question.
 * @apiSuccess (200) {String} subject Subject of the question.
 * @apiSuccess (200) {String} type Type of the question.
 * @apiSuccess (200) {Number} answer_time Time of the question.
 * @apiSuccess (200) {String} resource Resource of the question.
 * @apiSuccess (200) {Object[]} answers Answers of the question.
 * @apiSuccess (200) {Number} user_creator_id Id of the creator of the question.
 * @apiError (500) Error Prisma error.
 */
const getQuestionById = async (req: Request, res: Response): Promise<Response> => {
    try {
        let result = await prisma.question.findUnique({
            where: {
                id: Number(req.params.id)
            },
            select: {
                id: true,
                description: true,
                subject: true,
                type: true,
                answer_time: true,
                resource: true,
                answers: true,
                user_creator_id: true
            },
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

/**
 * @api {post} /question Create question
 * @apiName createQuestion()
 * @apiBody {String} description Description of the question.
 * @apiBody {String} subject Subject of the question.
 * @apiBody {String} type Type of the question.
 * @apiBody {Number} answer_time Time of the question.
 * @apiBody {String} resource Resource of the question.
 * @apiBody {Object[]} answers Answers of the question.
 * @apiBody {Number} user_creator_id Id of the creator of the question.
 * @apiGroup Question
 * @apiDescription Create a new question
 * @apiUser CheckQuestion
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) UserNotFound The user creator does not exists.
 * @apiError (500) AnswersMissing You must provide answers.
 * @apiError (500) TiemeNotValid You must provide an answer time greater than 5 seconds.
 * @apiError (500) FieldMissing You must provide all fields.
 * @apiError (500) OnlyOneCorrect Only one answer must be correct.
 * @apiError (500) AllAnswersCorrect All the answers must be correct.
 * @apiError (500) MultioptionQuestionError Multioption questions must have four answers.
 * @apiError (500) TrueFalseQuestionError True/false questions must have two answers.
 * @apiError (500) ShortQuestionError Short questions must have at least one answer and not more than four.
 * @apiError (500) Error Prisma error.
 */
const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { description, subject, type, answer_time, answers, resource, user_creator_id } = req.body;
        console.log(req.body)
        if (!description || !subject || !type || !answer_time || !answers || !user_creator_id)
            return res.status(500).json({ message: "Se deben proveer todos los campos necesarios" })
        const user = await prisma.user.findUnique({
            where: {
                id: user_creator_id,
            },
        })

        if (!user) {
            return res.status(404).json({ message: "El usuario no existe" })
        }
        if (answers.length == 0)
            return res.status(500).json({ message: "La pregunta debe tener respuestas" })
        if (answer_time < 5)
            return res.status(500).json({ message: "El tiempo de respuesta a una pregunta debe ser como mínimo de cinco segundos" })
        let correctAnswers = 0
        answers.forEach((answer: Answer) => {
            if (answer.is_correct)
                correctAnswers++
        })

        const message = checkQuestion(type, answers, correctAnswers)
        if (message != '')
            return res.status(500).json({ message: message })

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
        return res.status(200).json({ message: "La pregunta ha sido creada correctamente" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al crear la pregunta" })
    }
}

/**
 * @apiDefine CheckQuestion
 * @apiName checkQuestion()
 * @apiDescription Check if the question has a valid format.
 */
function checkQuestion(type: type, answers: any, correctAnswers: number): string {
    let message = ''
    switch (type) {
        case "multioption": {
            if (answers.length != 4)
                message = "Las preguntas de tipo multiopción han de tener cuatro respuestas"
            else if (correctAnswers != 1)
                message = "Solo puede haber una respuesta correcta"
            break;
        }
        case "true_false": {
            if (answers.length != 2)
                message = "Las preguntas de tipo verdader o falso han de tener dos respuestas"
            else if (correctAnswers != 1)
                message = "Solo puede haber una respuesta correcta"
            break;
        }
        case "short": {
            if (answers.length > 4)
                message = "Las preguntas de tipo respuesta corta han de tener entre una y cuatro respuestas"
            else if (correctAnswers != answers.length)
                message = "Todas las respuestas de las preguntas de tipo respuesta corta han de ser correctas"
            break;
        }
        default: {
            message = "El tipo especificado no existe"
            break
        }
    }
    return message
}

/**
 * @api {delete} /question/:id DeleteQuestion
 * @apiName deleteQuestion()
 * @apiParam {Number} id Id of the question.
 * @apiGroup Question
 * @apiDescription Delete a question
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidId The question id must be valid.
 * @apiError (400) AttachedToSurvey The question is attached to a survey and cannot be deleted.
 * @apiError (404) QuestionNotFound The question does not exists.
 * @apiError (500) Error Prisma error.
 */
const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de pregunta válido" })
        }
        const question = await prisma.question.findUnique({ 
            where: { id: Number(req.params.id) } ,
            select: {
                questionsSurvey: true
            }
        })
        if (!question)
            return res.status(404).json({ message: "La pregunta especificada no ha sido encontrada" })
        if(question.questionsSurvey.length > 0)
            return res.status(400).json({message: "La pregunta está asociada a algún cuestionario y no se puede borrar"})
        await prisma.question.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({ message: "La pregunta ha sido eliminada correctamente" })
    } catch (error) {
        return res.status(500).json({message: "Ha ocurrido un error al eliminar la pregunta"})
    }
}

/**
 * @api {get} /question/export/:id ExportQuestions
 * @apiName exportQuestions()
 * @apiParam {Number} id Id of the user creator.
 * @apiGroup Question
 * @apiDescription Export questions
 * @apiSuccess (200) {String} csv Csv with all the questions.
 * @apiError (400) InvalidId The user id must be valid.
 * @apiError (404) UserNotFound The user does not exists.
 * @apiError (500) Error Prisma error.
 */
const exportQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        let user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            }
        })
        if(!user) {
            return res.status(404).json({message: "El usuario especificado no existe"})
        }
        let result = await prisma.question.findMany({
            where: {
                user
            },
            include: {
                answers: true,
            }
        })
        console.log(result)
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
        const option: Options<QuestionCsv> = { quote: 'SDFAG', fields: [
            "descripcion",
            'tema',
            'tipo',
            'tiempo',
            'respuesta1',
            'correcta1',
            'respuesta2',
            'correcta2',
            'respuesta3',
            'correcta3',
            'respuesta4',
            'correcta4',
        ] }
        const csv = parse(questionsCsv, option)
        return res.status(200).json(csv);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Ha ocurrido un error al exportar las preguntas"})
    }
}

/**
 * @api {post} /question/file/:id ImportUsers
 * @apiName importUsers()
 * @apiParam {Number} id Id of the user creator.
 * @apiBody {Object} FormData FormData with the csv.
 * @apiGroup Question
 * @apiDescription Import questions using a csv.
 * @apiUse AddQuestions
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidId The user id is invalid.
 * @apiError (404) UserNotFound The user does not exist.
 * @apiError (500) Error Prisma error.
 * @apiError (500) EmptyFile The file cannot be empty.
 */
const importQuestions = async (req: Request, res: Response): Promise<Response> => {
    if (!req.params.id || isNaN(Number(req.params.id))) {
        return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
    }
    const user = await prisma.user.findFirst({ where: { id: Number(req.params.id) } })
    if (!user)
        res.status(500).json({ message: "El usuario no existe" })
    return new Promise(function (resolve, reject) {
        const form = new multiparty.Form()
        form.parse(req, function (err, fileds, files) {
            const questions: QuestionCsv[] = []
            parseFile(files.file[0].path, { headers: true })
                .on('error', error => {
                    res.status(500).json({ message: "Ha ocurrido un error al importar las preguntas" })
                })
                .on('data', row => {
                    questions.push(row)
                })
                .on('end', (rowCount: number) => {
                    if (rowCount == 0) {
                        res.status(500).json({ message: "El fichero no puede estar vacío" })
                    }
                    (async () => {
                        await addQuestion(res, questions, Number(req.params.id))
                        resolve(res)
                    })();
                })
        })
    })
}

/**
 * @apiDefine AddQuestions
 * @apiName AddQuestions()
 * @apiDescription Create all the questions given.
 */
async function addQuestion(res: Response, questions: QuestionCsv[], user_id: number) {
    try {
        let questionsPrisma: Prisma.questionCreateInput[] = []
        let hasMissingFields = false
        let hasIncorrectFields = false
        questions.forEach(question => {
            if (question.descripcion == '' || question.tema == '' || question.tiempo < 0 || question.tipo == '') {
                hasMissingFields = true
            }
            let answers: Answer[] = []
            answers.push({ description: question.respuesta1, is_correct: question.correcta1 === 'true' })
            if (question.respuesta2 != '') answers.push({ description: question.respuesta2!, is_correct: question.correcta2!! === 'true' })
            if (question.respuesta3 != '') answers.push({ description: question.respuesta3!, is_correct: question.correcta3!! === 'true' })
            if (question.respuesta4 != '') answers.push({ description: question.respuesta4!, is_correct: question.correcta4!! === 'true' })
            let correctAnswers = 0
            answers.forEach((answer: Answer) => {
                if (answer.is_correct)
                    correctAnswers++
            })

            if (checkQuestion(question.tipo as type, answers, correctAnswers) != '' || question.tiempo < 5)
                hasIncorrectFields = true

            questionsPrisma.push({
                description: question.descripcion,
                subject: question.tema,
                answer_time: Number(question.tiempo),
                type: question.tipo as type,
                user: {
                    connect: {
                        id: Number(user_id)
                    }
                },
                answers: {
                    createMany: {
                        data: answers
                    }
                }
            })
        })

        if (!hasMissingFields && !hasIncorrectFields) {
            for (const question of questionsPrisma) {
                await prisma.question.create({ data: question })
            }
            res.status(200).json({ message: "Las preguntas se han creado correctamente" })
        } else if (hasMissingFields) {
            res.status(500).json({ message: "No puede haber campos vacíos" })
        } else {
            res.status(500).json({ message: "Las preguntas no son válidas" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Ha ocurrido un error al importar las preguntas" })
    }
}

/**
 * @api {put} /question UpdateUser
 * @apiName updateQuestion()
 * @apiBody {String} id Id of the question.
 * @apiBody {String} description Description of the question.
 * @apiBody {String} subject Subject of the question.
 * @apiBody {String} type Type of the question.
 * @apiBody {Number} answer_time Time of the question.
 * @apiBody {String} resource Resource of the question.
 * @apiBody {Object[]} answers Answers of the question.
 * @apiGroup Question
 * @apiDescription Update a question
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (404) QuestionNotFound The question does not exists.
 * @apiError (500) EmptyAnswers The question must have answers.
 * @apiError (500) BadFormat The question must have a valid format.
 * @apiError (500) Error Prisma error.
 */
const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, description, subject, type, answer_time, answers, resource } = req.body
        const question = await prisma.question.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (question == null)
            return res.status(404).json({ message: "Pregunta no encontrada" })
        if (answers.length == 0)
            return res.status(500).json({ message: "La pregunta debe tener respuestas" })
        
        const newDescription = description != "" ? description : question.description
        const newSubject  = subject != "" ? subject : question.subject
        const newType = type != "" ? type : question.type
        const newAnswer_time = answer_time != "" ? answer_time : question.answer_time
        let correctAnswers = 0
            answers.forEach((answer: Answer) => {
                if (answer.is_correct)
                    correctAnswers++
            })
        let message = checkQuestion(newType as type, answers, correctAnswers) 
        console.log(message)
        if (checkQuestion(newType as type, answers, correctAnswers) != '' || newAnswer_time < 5)
            return res.status(500).json({message: "El formato de la pregunta es incorrecto"})

        await prisma.question.update({
            where: {
                id: Number(id)
            },
            data: {
                description: newDescription,
                subject: newSubject,
                type: newType as type,
                answer_time: newAnswer_time,
                resource: resource
            }
        })
        if(answers.length != 0){
            await prisma.answer.deleteMany({ where: { question_id: Number(id) } })
            for (const answer of answers) {
                await prisma.answer.create({
                    data: {
                        description: answer.description,
                        is_correct: answer.is_correct,
                        question_id: id
                    }
                })
    
            }
        }

        return res.status(200).json({ message: "Pregunta actualizada correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Ha ocurrido un error al actualizar la pregunta"})
    }
}

/**
 * @api {get} /question/courses/:id GetQuestionsByCourse
 * @apiName getQuestionsByCourse()
 * @apiParam {Number} id The id of the course.
 * @apiGroup Question
 * @apiDescription Get all course's questions.
 * @apiSuccess (200) {Object[]} questions An array with the questions retrieved.
 * @apiError (400) InvalidId You must provide a course valid id.
 * @apiError (500) Error Prisma error.
 */
const getQuestionsByCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const corseQuestion = await prisma.courseQuestion.findMany({
            where: {
                course_id: Number(req.params.id)
            },
            select: {
                question: {
                    select: {
                        id: true,
                        description: true,
                        resource: true,
                        type: true,
                        subject: true,
                        answer_time: true,
                        answers: true
                    }
                }
            }
        })
        const question = corseQuestion.map((question: any) => question.question)
        return res.status(200).json(question)
    } catch (error) {
        return res.status(500).json({message: "Ha ocurrido un error al obtener las preguntas"});
    }
}

/**
 * @api {delete} /question/:question_id/course/:course_id DeleteQuestionFromCourse
 * @apiName deleteQuestionFromCourse()
 * @apiParam {Number} question_id The id of the question.
 * @apiParam {Number} course_id The id of the course.
 * @apiGroup Question
 * @apiDescription Deletes a question from course.
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidQuestionId Invalid question id.
 * @apiError (400) InvalidCourseId Invalid course id.
 * @apiError (404) QuestionNotFound The question does not exists.
 * @apiError (404) CourseNotFound The course does not exists.
 * @apiError (500) Error Prisma error.
 */
const deleteQuestionFromCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.question_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de pregunta válido" })
        }
        if (!req.params.course_id) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const question = await prisma.question.findUnique({ where: { id: Number(req.params.question_id) } })
        if (!question)
            return res.status(404).json({ message: "La pregunta especificada no existe" })
        const course = await prisma.course.findUnique({ where: { id: Number(req.params.course_id) } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        await prisma.courseQuestion.delete({
            where: {
                question_id_course_id: {
                    course_id: Number(req.params.course_id),
                    question_id: Number(req.params.question_id)
                }
            }
        })
        return res.status(200).json({ message: "Pregunta eliminada del curso correctamente" })
    } catch (error) {
        return res.status(500).json({message: "Ha ocurrido un error al eliminar la pregunta del curso"})
    }
}


module.exports = {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions,
    updateQuestion,
    getQuestionById,
    deleteQuestion,
    getQuestionsByCourse,
    deleteQuestionFromCourse
}
