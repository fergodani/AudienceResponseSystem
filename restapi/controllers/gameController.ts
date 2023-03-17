import { Request, Response } from 'express';
import { Prisma, PrismaClient, state } from '@prisma/client'
const prisma = new PrismaClient()

const getGames = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.game.findMany()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

interface CoursesIds {
    course: string[]
}

const getOpenGamesByCourses = async (req: Request<{}, {}, {}, CoursesIds>, res: Response): Promise<Response> => {
    try {
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
                        questions: {
                            include: {
                                answers: true
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
            are_questions_visible: (are_questions_visible === 'true'),
            point_type
        }
        const gameSaved = await prisma.game.create({
            data: game,
            include: {
                survey: {
                    include: {
                        questions: {
                            include: {
                                answers: true
                            }
                        }
                    }
                }
            }
        })
        return res.status(200).json(gameSaved)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports = {
    getGames,
    createGame,
    getOpenGamesByCourses
}