import { Request, Response } from 'express';
import { Prisma, state } from '@prisma/client'
import { UserResult } from '../models/user.model';
import { AnswerResult } from '../models/answer.model';
import { QuestionSurvey } from '../models/question.model';
import prisma from '../prisma/prismaClient';

/**
 * @api {get} /game/:id Get game by id
 * @apiName getGameById
 * @apiParam {Number} id Game id
 * @apiGroup Game
 * @apiDescription Get the game giving its id.
 * @apiSuccess (200) {String} id Id of the game.
 * @apiSuccess (200) {String} state State of the game.
 * @apiSuccess (200) {Boolean} are_quetions_visible If questions are visible.
 * @apiSuccess (200) {Number} host_id Id of the host.
 * @apiSuccess (200) {Number} survey_id Id of the survey.
 * @apiSuccess (200) {String} point_type Point type of the game.
 * @apiSuccess (200) {Object} survey Survey object of the game.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @api {get} /game/course Get open or started games by courses
 * @apiName getOpenOrStartedGamesByCourses
 * @apiQuery {Number[]} course Ids of the courses
 * @apiGroup Game
 * @apiDescription Get open or started games giving a course.
 * @apiSuccess (200) {Object[]} games Games retrieved.
 * @apiError (400) MissingFields You must provide all required fields.
 * @apiError (500) MissingCourses You must provide at least one course.
 * @apiError (500) Error Prisma error.
 */
const getOpenOrStartedGamesByCourses = async (req: Request<{}, {}, {}, CoursesIds>, res: Response): Promise<Response> => {
    try {
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

/**
 * @api {post} /game Create game
 * @apiName createGame()
 * @apiBody {Number} host_id Id of the host.
 * @apiBody {Number} survey_id Id of the survey.
 * @apiBody {Number} course_id Id of the course.
 * @apiBody {String} type Type of the game.
 * @apiBody {String} state State of the game.
 * @apiBody {Boolean} are_questions_visible If questions are visible.
 * @apiBody {String} point_type Type of the points of the game.
 * @apiGroup Game
 * @apiDescription Create a new game
 * @apiSuccess (200) {Object} game Returns the created game.
 * @apiError (404) UserNotFound The user host does not exists.
 * @apiError (404) CourseNotFound The course does not exists.
 * @apiError (404) SurveyNotFound The survey does not exists.
 * @apiError (500) FieldMissing You must provide all fields.
 * @apiError (500) Error Prisma error.
 */
const createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        const { host_id, survey_id, course_id, type, state, are_questions_visible, point_type } = req.body;

        if (!host_id || !survey_id || !type || !state || are_questions_visible == undefined || !point_type || !course_id) {
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

/**
 * @api {put} /survey Update state
 * @apiName updateState()
 * @apiBody {String} id Id of the game.
 * @apiBody {String} state State of the game.
 * @apiGroup Game
 * @apiDescription Update the state of a game.
 * @apiSuccess (200) {Object} game Returns the updated game.
 * @apiError (404) GameNotFound The game does not exists.
 * @apiError (500) InvalidId The survey id must be valid.
 * @apiError (500) FieldMissing You must provide all requiered fields.
 * @apiError (500) Error Prisma error.
 */
const updateState = async (req: Request, res: Response): Promise<Response> => {
    try {
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

/**
 * @api {post} /game/results Create game results
 * @apiName createResults()
 * @apiBody {Object[]} results Array with the results to create.
 * @apiGroup Game
 * @apiUser GetCorrectAndIncorrectAnswers
 * @apiDescription Create game results.
 * @apiSuccess (200) {Object} game Returns the created game.
 * @apiError (500) ResultsMissing You must provide at least one result.
 * @apiError (500) Error Prisma error.
 */
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

/**
 * @apiDefine GetCorrectAndIncorrectAnswers
 * @apiName getCorrectAndIncorrectAnswers()
 * @apiDescription Return correct and incorrect answers
 */
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

/**
 * @api {get} /game/results/:id Get game results by user
 * @apiName getGamesResultsByUser
 * @apiParam {Number} id User id
 * @apiGroup Game
 * @apiDescription Get the results of the games played by an user.
 * @apiSuccess (200) {Object[]} results Array with the results.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (404) UserNotFound User does not exist.
 * @apiError (500) Error Prisma error.
 */
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
                        course: {
                            select: {
                                name: true
                            }
                        },
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

/**
 * @api {get} /game/results/:game_id Get game results by game
 * @apiName getGameResultsByGame
 * @apiParam {Number} game_id Game id
 * @apiGroup Game
 * @apiDescription Get all the user results of the game provided.
 * @apiSuccess (200) {Object[]} results Array with the results.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (404) GameNotFound Game does not exist.
 * @apiError (500) Error Prisma error.
 */
const getGameResultsByGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.game_id || isNaN(Number(req.params.game_id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de juego válido" })
        }
        const game = await prisma.game.findUnique({ where: { id: Number(req.params.game_id) } })
        if (!game)
            return res.status(404).json({ message: "El juego especificado no existe" })
        const result = await prisma.gameResult.findMany({
            where: {
                game_id: Number(req.params.game_id)
            },
            select: {
                score: true,
                correct_questions: true,
                total_questions: true,
                wrong_questions: true,
                user: {
                    select: {
                        username: true,
                    }
                },
                game_id: true,
                answer_results: true,
                game: {
                    select: {
                        survey: {
                            select: {
                                title: true,
                            }
                        },
                        course_id: true
                    }
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los resultados" })
    }
}

/**
 * @api {get} /game/course/:id Get game by course
 * @apiName getGamesByCourse
 * @apiParam {Number} id Course id
 * @apiGroup Game
 * @apiDescription Get all the course's games.
 * @apiSuccess (200) {Object[]} games Array with the games.
 * @apiError (400) InvalidId You must provide a valid id.
 * @apiError (404) CourseNotFound Course does not exist.
 * @apiError (500) Error Prisma error.
 */
const getGamesByCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de curso válido" })
        }
        const course = await prisma.course.findUnique({ where: { id: Number(req.params.id) } })
        if (!course)
            return res.status(404).json({ message: "El curso especificado no existe" })
        const result = await prisma.game.findMany({
            where: {
                course_id: Number(req.params.id)
            },
            select: {
                id: true,
                created_at: true,
                survey: {
                    select: {
                        title: true,
                    }
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los resultados" })
    }
}

/**
 * @api {get} /game/results/user/:user_id/course/:course_id Get game results by user and course
 * @apiName getGamesResultsByUserAndCourse
 * @apiParam {Number} user_id User id
 * @apiParam {Number} course_id Course id
 * @apiGroup Game
 * @apiDescription Get all the user results of the course provided.
 * @apiSuccess (200) {Object[]} results Array with the results.
 * @apiError (400) InvalidUserId You must provide a valid user id.
 * @apiError (400) InvalidCourseId You must provide a valid course id.
 * @apiError (404) UserNotFound User does not exist.
 * @apiError (404) CourseNotFound Course does not exist.
 * @apiError (500) Error Prisma error.
 */
const getGamesResultsByUserAndCourse = async (req: Request, res: Response): Promise<Response> => {
    try {
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

/**
 * @api {get} /game/results/user/:user_id/game/:game_id" Get game result by user and game
 * @apiName getGameResultByUserAndGame
 * @apiParam {Number} user_id User id
 * @apiParam {Number} game_id Game id
 * @apiGroup Game
 * @apiDescription Get the user result of the game provided.
 * @apiSuccess (200) {Object} result Array with the results.
 * @apiError (400) InvalidUserId You must provide a valid user id.
 * @apiError (400) InvalidGameId You must provide a valid game id.
 * @apiError (404) UserNotFound User does not exist.
 * @apiError (404) GameNotFound Game does not exist.
 * @apiError (500) Error Prisma error.
 */
const getGameResultByUserAndGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.params.user_id || isNaN(Number(req.params.user_id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de usuario válido" })
        }
        if (!req.params.game_id || isNaN(Number(req.params.game_id))) {
            return res.status(400).json({ message: "Debe proporcionar un ID de juego válido" })
        }
        const user = await prisma.user.findUnique({ where: { id: Number(req.params.user_id) } })
        if (!user)
            return res.status(404).json({ message: "El usuario especificado no existe" })
        const game = await prisma.game.findUnique({ where: { id: Number(req.params.game_id) } })
        if (!game)
            return res.status(404).json({ message: "El juego especificado no existe" })

        const result = await prisma.gameResult.findUnique({
            where: {
                game_id_user_id: {
                    user_id: Number(req.params.user_id),
                    game_id: Number(req.params.game_id)
                }
            },
            select: {
                score: true,
                correct_questions: true,
                total_questions: true,
                wrong_questions: true,
                user_id: true,
                game_id: true,
                answer_results: {
                    select: {
                        question_id: true,
                        answer: true,
                        answered: true,
                        short_answer: true
                    }
                },
                game: {
                    select: {
                        course_id: true,
                        survey: {
                            select: {
                                title: true,
                                questionsSurvey: {
                                    select: {
                                        question: {
                                            include: {
                                                answers: true
                                            }
                                        },
                                        position: true
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
        return res.status(500).json({ message: "Ha ocurrido un error al obtener los resultados" })
    }
}

/**
 * @api {delete} /game/:id DeleteGame
 * @apiName deleteGame()
 * @apiParam {Number} id Id of the game.
 * @apiGroup Game
 * @apiDescription Delete a game
 * @apiSuccess (200) {Object} message Success message.
 * @apiError (400) InvalidId The survey id must be valid.
 * @apiError (404) GameNotFound The game does not exists.
 * @apiError (500) Error Prisma error.
 */
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
    getGamesByCourse,
    getGameResultByUserAndGame,
    getGamesResultsByUser,
    getGameResultsByGame,
    getGamesResultsByUserAndCourse,
    getGameById,
    deleteGame
}