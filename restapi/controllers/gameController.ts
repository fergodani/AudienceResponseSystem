import { Request, Response } from 'express';
import { Prisma, state } from '@prisma/client'
import { UserResult } from '../models/user.model';
import { AnswerResult } from '../models/answer.model';
import prisma from '../prisma/prismaClient';
import { QuestionSurvey } from '../models/question.model';

const getGameById = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de juego válido" })
        }
        let result = await prisma.game.findUnique({
            where: {
                id: Number(req.params.id)
            },
            select: {
                id: true,
                state: true,
                are_questions_visible: true,
                host_id: true,
                survey_id: true,
                point_type: true,
                survey: {
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
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al obtener el juego" })
    }
}

interface CoursesIds {
    course: string[]
}

const getOpenOrStartedGamesByCourses = async (req: Request<{}, {}, {}, CoursesIds>, res: Response): Promise<Response> => {
    try {
        console.log(req.query)
        if (!req.query.course) {
            return res.status(500).json({ message: "Se deben de pasar los parámetros correspondientes" })
        }
        let coursesIds: number[] = [];
        if (!Array.isArray(req.query.course)) {
            coursesIds.push(Number(req.query.course))
        } else {
            coursesIds = req.query.course.map(id => Number(id))
        }

        if (coursesIds.length == 0) {
            return res.status(500).json({ message: "Se deben de pasar al menos un curso" })
        }

        let courseSurveys = await prisma.courseSurvey.findMany({
            where: {
                course_id: {
                    in: coursesIds
                }
            }
        })
        const surveysIds: number[] = courseSurveys.map(c => c.survey_id)
        let result = await prisma.game.findMany({
            where: {
                OR: [
                    {
                        state: state.created
                    },
                    {
                        state: state.started
                    }
                ],
                survey: {
                    id: {
                        in: surveysIds
                    }
                },
            },
            select: {
                id: true,
                state: true,
                are_questions_visible: true,
                host_id: true,
                survey_id: true,
                point_type: true,
                survey: {
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
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los juegos" })
    }
}

const createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { host_id, survey_id, course_id, type, state, are_questions_visible, point_type } = req.body;
        if (!host_id || !survey_id || !type || !state || !are_questions_visible || !point_type || !course_id) {
            return res.status(500).json({ message: "Se deben proporcionar todos los parámetros" })
        }

        const user = await prisma.user.findFirst({ where: { id: host_id } })
        if (!user)
            return res.status(404).json({ message: "El usuario especificado como host no existe" })

        const survey = await prisma.survey.findFirst({ where: { id: survey_id } })
        if (!survey)
            return res.status(404).json({ message: "El cuestionario especificado no existe" })

        const course = await prisma.course.findUnique({ where: { id: course_id } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })

        let game: Prisma.gameCreateInput;
        game = {
            user: {
                connect: { id: host_id }
            },
            survey: {
                connect: { id: survey_id }
            },
            type,
            state,
            are_questions_visible: (are_questions_visible),
            point_type,
            course: {
                connect: { id: course_id }
            }
        }
        const gameSaved = await prisma.game.create({
            data: game,
            select: {
                id: true,
                state: true,
                are_questions_visible: true,
                host_id: true,
                survey_id: true,
                point_type: true,
                survey: {
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
                }
            }
        })

        return res.status(200).json(gameSaved)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al crear el juego" })
    }
}

const updateState = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.body)
        if (!req.body.id || isNaN(Number(req.body.id))) {
            return res.status(500).json({ message: "Debe proporcionar un ID de juego válido" })
        }

        if (!req.body.id || !req.body.state) {
            return res.status(500).json({ message: "Se deben proporcionar todos los parámetros necesarios" })
        }
        const game = await prisma.game.findFirst({ where: { id: Number(req.body.id) } })
        if (!game)
            return res.status(404).json({ message: "El juego especificado no existe" })
        const updateGame = await prisma.game.update({
            where: {
                id: Number(req.body.id)
            },
            data: {
                state: req.body.state
            },
            select: {
                id: true,
                state: true,
                are_questions_visible: true,
                host_id: true,
                survey_id: true,
                point_type: true,
                survey: {
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
                }
            }
        })

        return res.status(200).json(updateGame)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al actualizar el juego" })
    }
}

const createResults = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (req.body.length == 0)
            return res.status(500).json({ message: "Tiene que haber al menos un resultado" })

        const userResults: UserResult[] = req.body
        const game = await prisma.game.findUnique({
            where: { id: userResults[0].game_id },
            select: {
                survey: {
                    select: {
                        questionsSurvey: {
                            select: {
                                question: {
                                    select: {
                                        answers: true
                                    }
                                },
                                position: true,
                            }
                        }
                    }
                }
            }
        })
        const userResultsMapped = userResults.map((userResult: UserResult) => {
            let answers = getCorrectAndIncorrectAnswers(game, userResult)
            return {
                user_id: userResult.user_id,
                game_id: userResult.game_id,
                score: userResult.score,
                total_questions: Number(game?.survey?.questionsSurvey.length),
                correct_questions: answers.correctAnswers,
                wrong_questions: answers.wrongAnswers
            }
        })
        let answerResults: AnswerResult[] = [];
        userResults.forEach((uR: UserResult) => {
            answerResults = answerResults.concat(uR.answer_results)
        })
        const answerResultsMapped = answerResults.map((aR: AnswerResult) => ({
            user_id: aR.user_id,
            game_id: aR.game_id,
            question_id: aR.question_id,
            answer_id: aR.answer_id,
            short_answer: aR.short_answer,
            question_index: aR.question_index,
            answered: aR.answered
        }))
        await prisma.gameResult.createMany({
            data: userResultsMapped,
        })
        await prisma.answerResult.createMany({
            data: answerResultsMapped
        })
        return res.status(200).json({ message: "Los resultados se han creado correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al crear los resultados del juego" })
    }
}

// Devuelve el número de preguntas correctas e incorrectas
function getCorrectAndIncorrectAnswers(game: any, userResult: UserResult) {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    game.survey.questionsSurvey.forEach((qS: QuestionSurvey) => {
        // Resultado correspondiente a la pregunta
        let answerResult = userResult.answer_results.find(aR => aR.question_index == qS.position)
        if (answerResult == undefined || answerResult?.answered) {
            let answers = qS.question?.answers
            if (answers != undefined) {
                let actualAnswer = answers.find(answer => answer.id == answerResult?.answer_id)
                correctAnswers = actualAnswer?.is_correct ? correctAnswers + 1 : correctAnswers;
                wrongAnswers = !actualAnswer?.is_correct ? wrongAnswers + 1 : wrongAnswers;
            }

        }
    });
    return {
        correctAnswers,
        wrongAnswers
    }
}

const getGamesResultsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } })
        if (!user)
            return res.status(404).json({ message: "El usuario especificado no existe" })
        const result = await prisma.gameResult.findMany({
            where: {
                user_id: Number(req.params.id)
            },
            select: {
                score: true,
                correct_questions: true,
                total_questions: true,
                wrong_questions: true,
                user_id: true,
                game_id: true,
                answer_results: true,
                game: {
                    select: {
                        survey: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        })
        console.log(result)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los resultados" })
    }
}

const getGamesResultsByUserAndCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.params)
        if (!req.params.user_id || isNaN(Number(req.params.user_id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        if (!req.params.course_id || isNaN(Number(req.params.course_id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const user = await prisma.user.findUnique({ where: { id: Number(req.params.user_id) } })
        if (!user)
            return res.status(404).json({ message: "El usuario especificado no existe" })
        const course = await prisma.course.findUnique({ where: { id: Number(req.params.course_id) } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        console.log("hola cai")
        const result = await prisma.gameResult.findMany({
            where: {
                AND: [
                    {
                        user_id: Number(req.params.user_id)
                    },
                    {
                        game: {
                            course_id: Number(req.params.course_id)
                        }
                    }
                ]
            },
            select: {
                score: true,
                correct_questions: true,
                total_questions: true,
                wrong_questions: true,
                user_id: true,
                game_id: true,
                answer_results: true,
                game: {
                    select: {
                        survey: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        })
        console.log(result)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los resultados" })
    }
}

const deleteGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de juego válido" })
        }
        const game = await prisma.game.findFirst({ where: { id: Number(req.params.id) } })
        if (!game)
            return res.status(404).json({ message: "El juego especificado no existe" })
        await prisma.game.delete({
            where: {
                id: Number(req.params.id)
            },
        })
        return res.status(200).json({ message: "El juego se ha eliminado correctamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el juego" })
    }
}

module.exports = {
    createGame,
    getOpenOrStartedGamesByCourses,
    updateState,
    createResults,
    getGamesResultsByUser,
    getGamesResultsByUserAndCourse,
    getGameById,
    deleteGame
}