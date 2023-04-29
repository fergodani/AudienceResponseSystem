import { Request, Response } from 'express';
import { Prisma, PrismaClient, state } from '@prisma/client'
import { UserResult } from '../models/user.model';
import { AnswerResult } from '../models/answer.model';
import { QuestionSurvey } from '../models/question.model';
import { Game } from '../models/game.model';
const prisma = new PrismaClient()

const getGames = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.game.findMany()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const getGameById = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.game.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                survey: {
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
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

interface CoursesIds {
    course: string[]
}

const getOpenGamesByCourses = async (req: Request<{}, {}, {}, CoursesIds>, res: Response): Promise<Response> => {
    try {
        console.log("Getting open games by courses")
        let coursesIds: number[] = [];
        if(!Array.isArray(req.query.course)){
            coursesIds.push(Number(req.query.course))
        }else {
            coursesIds = req.query.course.map(id => Number(id))
        }
        
        let courseSurveys = await prisma.courseSurvey.findMany({
            where: {
                course_id: {
                    in: coursesIds
                }
            }
        })
        const surveysIds: number[] = courseSurveys.map( c => c.survey_id)
        let result = await prisma.game.findMany({
            where: {
                state: state.created,
                survey: {
                    id: {
                        in: surveysIds
                    }
                },
            },
            include: {
                survey: {
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
                }
            }
        })
        console.log(result)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

const createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { host_id, survey_id, type, state, are_questions_visible, point_type } = req.body;
        let game: Prisma.gameCreateInput;
        game = {
            user: {
                connect: {id: host_id}
            },
            survey: {
                connect: {id: survey_id}
            },
            type,
            state,
            are_questions_visible: (are_questions_visible),
            point_type
        }
        const gameSaved = await prisma.game.create({
            data: game,
            include: {
                survey: {
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
                }
            }
        })
        console.log(gameSaved)
        return res.status(200).json(gameSaved)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

const updateGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const updateGame = await prisma.game.update({
            where: {
                id: req.body.id
            },
            data: {
                state: req.body.state
            }
        })
        if (!updateGame)
            return res.status(404).json({message: "Game not found"})
        return res.status(200).json(updateGame)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

const createResults = async (req:Request, res: Response): Promise<Response> => {
    try {
        const userResults: UserResult[] = req.body
        const userResultsMapped = userResults.map((userResult: UserResult) => ({
            user_id: userResult.user_id,
            game_id: userResult.game_id,
            score: userResult.score
        }))
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
        return res.status(200).json({message: "Results uploaded"})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

const getGamesResultsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await prisma.gameResult.findMany({
            where: {
                user_id: Number(req.params.id)
            },
            include: {
                answer_results: {
                    include: {
                        answer: true
                    }
                },
                game: {
                    include: {
                        survey: {
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
                        }
                    }
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports = {
    getGames,
    createGame,
    getOpenGamesByCourses,
    updateGame,
    createResults,
    getGamesResultsByUser,
    getGameById
}