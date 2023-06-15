import { Prisma, role, game_type, point_type, state, type } from "@prisma/client"
import prisma from "../prisma/prismaClient"

const {
    createGame,
    getOpenOrStartedGamesByCourses,
    updateState,
    createResults,
    getGamesResultsByUser,
    getGameById,
    deleteGame
} = require('../controllers/gameController')

let user: Prisma.userUncheckedCreateInput = {
    id: 1,
    username: "test",
    password: "test",
    role: role.professor
}
let survey1: Prisma.surveyUncheckedCreateInput = {
    id: 1,
    title: "test1",
    user_creator_id: 1
}
let game: Prisma.gameUncheckedCreateInput = {
    id: 1,
    host_id: 1,
    survey_id: 1,
    state: state.created,
    point_type: point_type.standard,
    type: game_type.online,
    are_questions_visible: true
}

describe("Game", () => {
    describe("Create game", () => {
        describe("With valid input data", () => {
            describe("User host and survey attached exists", () => {
                beforeAll(async () => {
                    await prisma.user.create({ data: user })
                    await prisma.survey.create({ data: survey1 })
                })
                afterAll(async () => {
                    await prisma.game.deleteMany({ where: { host_id: user.id } })
                    await prisma.survey.deleteMany({ where: { id: survey1.id } })
                    await prisma.user.deleteMany({ where: { id: user.id } })
                })
                it("game created successfully", async () => {
                    const req = {
                        body: {
                            host_id: user.id,
                            survey_id: survey1.id,
                            type: game_type.online,
                            state: state.created,
                            are_questions_visible: true,
                            point_type: point_type.standard
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    const game = await prisma.game.findFirst({
                        where: { host_id: user.id },
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
                    expect(game?.are_questions_visible).toBe(true)
                    expect(game?.host_id).toBe(user.id)
                    expect(game?.point_type).toBe(point_type.standard)
                    expect(game?.state).toBe(state.created)
                    expect(game?.are_questions_visible).toBe(true)
                    expect(game?.survey).not.toBeNull()
                });
            })
            describe("User creator does not exist", () => {
                it("should return error", async () => {
                    const req = {
                        body: {
                            host_id: 999,
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El usuario especificado como host no existe" });
                })
            })
            describe("Survey attached does not exist", () => {
                beforeAll(async () => {
                    await prisma.user.create({ data: user })
                })
                afterAll(async () => {
                    await prisma.user.delete({ where: { id: user.id } })
                })
                it("should return error", async () => {
                    const req = {
                        body: {
                            host_id: user.id
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario especificado no existe" });
                })
            })

        })

        describe("Try to create a game with wrong fields", () => {
            describe('With missing field', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {

                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Se deben proporcionar todos los parámetros" });
                });
            })
            describe('With wrong data types', () => {
                beforeAll(async () => {
                    await prisma.user.create({ data: user })
                })
                afterAll(async () => {
                    await prisma.user.deleteMany({ where: { id: user.id } })
                })
                it("should return 500", async () => {
                    const req = {
                        body: {
                            host_id: "test"
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el juego" });
                })
            })
        })
    })

    describe("Update state", () => {
        describe("Game exists", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.survey.create({ data: survey1 })
                await prisma.game.create({ data: game })
            })
            afterAll(async () => {
                await prisma.game.deleteMany({ where: { host_id: user.id } })
                await prisma.survey.deleteMany({ where: { id: survey1.id } })
                await prisma.user.deleteMany({ where: { id: user.id } })
            })
            it("should update state", async () => {
                const req = {
                    body: {
                        state: state.closed
                    },
                    params: {
                        id: 1
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateState(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                const game = await prisma.game.findFirst({
                    where: { host_id: user.id },
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
                expect(game?.are_questions_visible).toBe(true)
                expect(game?.host_id).toBe(user.id)
                expect(game?.point_type).toBe(point_type.standard)
                expect(game?.state).toBe(state.closed)
                expect(game?.are_questions_visible).toBe(true)
                expect(game?.survey).not.toBeNull()
            })
        })
        describe("Failure", () => {
            describe("Game not exists", () => {
                it("should return 404", async () => {
                    const req = {
                        body: {
                            state: state.closed
                        },
                        params: {
                            id: 999
                        }
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }
                    await updateState(req, res);
                    expect(res.json).toHaveBeenCalledWith({ message: "El juego especificado no existe" });
                    expect(res.status).toHaveBeenCalledWith(404);

                });
            })
            it("should return error if empty params", async () => {
                const req = {
                    body: {
                    },
                    params: {}
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateState(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
            })
            it("should return error if wrong id", async () => {
                const req = {
                    body: {
                        state: state.closed
                    },
                    params: {
                        id: "test"
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateState(req, res);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
                expect(res.status).toHaveBeenCalledWith(500);

            })
        })

    })

    describe("Delete game", () => {
        describe("Exists game", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.survey.create({ data: survey1 })
                await prisma.game.create({ data: game })
            })
            afterAll(async () => {
                await prisma.survey.deleteMany({ where: { id: survey1.id } })
                await prisma.user.deleteMany({ where: { id: user.id } })
            })

            it("should delete the survey", async () => {
                const req = { params: { id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteGame(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "El juego se ha eliminado correctamente" });
                const gameResult = await prisma.game.findFirst({ where: { id: 1 } })
                expect(gameResult).toBeNull()
            })
        })

        describe("Failure", () => {
            describe("Survey not exists", () => {
                it("should return 404", async () => {
                    const req = {
                        params: {
                            id: 999
                        }
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }
                    await deleteGame(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El juego especificado no existe" });
                });
            })

            describe("When providing an invalid id", () => {
                describe("Should return 400", () => {
                    it("with no id", async () => {
                        const mockReq = { params: {} };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteGame(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de juego válido" });
                    });

                    it("with invalid id", async () => {
                        const mockReq = { params: { id: "invalid" } };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteGame(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de juego válido" });
                    });
                })

            })

        })

    })

    describe("Get game by id", () => {
        describe("there are at least one game", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.survey.create({ data: survey1 })
                await prisma.game.create({ data: game })
            })
            afterAll(async () => {
                await prisma.game.deleteMany({ where: { host_id: user.id } })
                await prisma.survey.deleteMany({ where: { id: survey1.id } })
                await prisma.user.deleteMany({ where: { id: user.id } })
            })

            it("should retrive the game with the id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getGameById(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({
                    id: game.id,
                    host_id: game.host_id,
                    survey_id: game.survey_id,
                    state: game.state,
                    point_type: game.point_type,
                    are_questions_visible: game.are_questions_visible,
                    survey: {
                        id: survey1.id,
                        questionsSurvey: [],
                        title: survey1.title,
                        user_creator_id: survey1.user_creator_id
                    }
                })
            })
        })
        describe("There are no games", () => {
            it("should retrive null", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getGameById(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith(null)
            })
        })
        describe("When providing an invalid id", () => {
            describe("Should return 400", () => {
                it("with no id", async () => {
                    const mockReq = { params: {} };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getGameById(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de juego válido" });
                });

                it("with invalid id", async () => {
                    const mockReq = { params: { id: "invalid" } };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getGameById(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de juego válido" });
                });
            })

        })
    })

    describe("Get open or started games by courses", () => {
        describe("Success", () => {
            let survey2: Prisma.surveyUncheckedCreateInput = {
                id: 2,
                title: "test1",
                user_creator_id: 1
            }
            let survey3: Prisma.surveyUncheckedCreateInput = {
                id: 3,
                title: "test1",
                user_creator_id: 1
            }
            let game2: Prisma.gameUncheckedCreateInput = {
                id: 2,
                host_id: 1,
                survey_id: 2,
                state: state.started,
                point_type: point_type.standard,
                type: game_type.online,
                are_questions_visible: true
            }
            let game3: Prisma.gameUncheckedCreateInput = {
                id: 3,
                host_id: 1,
                survey_id: 3,
                state: state.closed,
                point_type: point_type.standard,
                type: game_type.online,
                are_questions_visible: true
            }
            const course1: Prisma.courseUncheckedCreateInput = {
                id: 1,
                name: "courseTest",
                description: "courseDescriptionTest",
            }
            const course2: Prisma.courseUncheckedCreateInput = {
                id: 2,
                name: "courseTest1",
                description: "courseDescriptionTest",
            }
            const courseSurvey1: Prisma.courseSurveyUncheckedCreateInput = {
                course_id: course1.id!,
                survey_id: survey1.id!
            }
            const courseSurvey2: Prisma.courseSurveyUncheckedCreateInput = {
                course_id: course1.id!,
                survey_id: survey3.id!
            }
            const courseSurvey3: Prisma.courseSurveyUncheckedCreateInput = {
                course_id: course2.id!,
                survey_id: survey2.id!
            }
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.course.createMany({ data: [course1, course2] })
                await prisma.survey.createMany({ data: [survey1, survey2, survey3] })
                await prisma.courseSurvey.createMany({ data: [courseSurvey1, courseSurvey2, courseSurvey3] })
                await prisma.game.createMany({ data: [game, game2, game3] })
            })
            afterAll(async () => {
                await prisma.courseSurvey.deleteMany({ where: { AND: [{ course_id: course1.id }, { course_id: course2.id }] } })
                await prisma.course.deleteMany({ where: { name: { startsWith: "courseTest" } } })
                await prisma.game.deleteMany({ where: { are_questions_visible: true } })
                await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                await prisma.user.delete({ where: { id: user.id } })
            })
            it("should return all the games open or started from the courses given and not the closed one", async () => {
                const req = {
                    query: {
                        course: [1, 2]
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getOpenOrStartedGamesByCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([
                    {
                        id: game.id,
                        host_id: game.host_id,
                        survey_id: game.survey_id,
                        state: game.state,
                        point_type: game.point_type,
                        are_questions_visible: game.are_questions_visible,
                        survey: {
                            id: survey1.id,
                            questionsSurvey: [],
                            title: survey1.title,
                            user_creator_id: survey1.user_creator_id
                        }
                    },
                    {
                        id: game2.id,
                        host_id: game2.host_id,
                        survey_id: game2.survey_id,
                        state: game2.state,
                        point_type: game2.point_type,
                        are_questions_visible: game2.are_questions_visible,
                        survey: {
                            id: survey2.id,
                            questionsSurvey: [],
                            title: survey2.title,
                            user_creator_id: survey2.user_creator_id
                        }
                    }
                ])

            })
        })
        describe("Failure", () => {
            it("should return error if courses is missing", async () => {
                const req = {
                    query: {
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getOpenOrStartedGamesByCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Se deben de pasar los parámetros correspondientes" })
            })
            it("should return error if courses is empty", async () => {
                const req = {
                    query: {
                        course: []
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getOpenOrStartedGamesByCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Se deben de pasar al menos un curso" })
            })
        })
    })

    describe("Create results", () => {
        let question: Prisma.questionUncheckedCreateInput = {
            id: 1,
            description: "test1",
            subject: "test1",
            type: type.multioption,
            answer_time: 5,
            user_creator_id: 1,
            resource: null,
        }
        let answer: Prisma.answerUncheckedCreateInput = {
            id: 1,
            question_id: question.id!,
            description: "test",
            is_correct: true
        }
        describe("Success", () => {
            let user2: Prisma.userUncheckedCreateInput = {
                id: 2,
                username: "test2",
                password: "test",
                role: role.student,
            }
            beforeAll(async () => {
                await prisma.user.createMany({ data: [user, user2] })
                await prisma.question.create({ data: question })
                await prisma.answer.create({ data: answer })
                await prisma.survey.create({ data: survey1 })
                await prisma.game.create({ data: game })
            })
            afterAll(async () => {
                await prisma.answerResult.deleteMany({ where: { game_id: game.id } })
                await prisma.gameResult.deleteMany({ where: { game_id: game.id } })
                await prisma.game.delete({ where: { id: game.id } })
                await prisma.survey.delete({ where: { id: survey1.id } })
                await prisma.question.delete({ where: { id: question.id } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })
            it("should create the results correctly", async () => {
                const req = {
                    body: [
                        {
                            user_id: 1,
                            game_id: 1,
                            answer_results: [
                                {
                                    game_id: 1,
                                    user_id: 1,
                                    question_id: 1,
                                    answer_id: 1,
                                    short_answer: null,
                                    question_index: 1,
                                    answered: true
                                }
                            ],
                            score: 10
                        },
                        {
                            user_id: 2,
                            game_id: 1,
                            answer_results: [
                                {
                                    game_id: 1,
                                    user_id: 2,
                                    question_id: 1,
                                    answer_id: 1,
                                    short_answer: null,
                                    question_index: 1,
                                    answered: false
                                }
                            ],
                            score: 15
                        }
                    ]
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await createResults(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({ message: "Los resultados se han creado correctamente" })
                const results = await prisma.gameResult.findMany({
                    where: { game_id: game.id },
                    select: {
                        game_id: true,
                        user_id: true,
                        score: true,
                        answer_results: {
                            select: {
                                user_id: true,
                                game_id: true,
                                question_id: true,
                                answer_id: true,
                                question_index: true,
                                answered: true
                            }
                        }
                    }
                })

                expect(results.length).toBe(2)
                expect(results[0].game_id).toBe(game.id)
                expect(results[0].user_id).toBe(user.id)
                expect(results[0].score).toBe(10)
                expect(results[0].answer_results.length).toBe(1)
                expect(results[0].answer_results[0].answer_id).toBe(answer.id)
                expect(results[0].answer_results[0].question_index).toBe(1)
                expect(results[0].answer_results[0].answered).toBe(true)
                expect(results[0].answer_results[0].question_id).toBe(question.id)
                expect(results[1].game_id).toBe(game.id)
                expect(results[1].user_id).toBe(user2.id)
                expect(results[1].score).toBe(15)
                expect(results[1].answer_results.length).toBe(1)
                expect(results[1].answer_results[0].answer_id).toBe(answer.id)
                expect(results[1].answer_results[0].question_index).toBe(1)
                expect(results[1].answer_results[0].answered).toBe(false)
                expect(results[1].answer_results[0].question_id).toBe(question.id)
            })
        })
        describe("Failure", () => {
            it("should return an error if body has wrong format", async () => {
                const req = {
                    body: [
                        {
                            user_id: 1,
                            game_id: 1,
                            answer_results: [
                                {
                                    game_id: 1,
                                    user_id: 1,
                                    question_id: 1,
                                    answer_id: 1,
                                    short_answer: null,
                                    question_index: 1,
                                    answered: true
                                }
                            ]
                        }
                    ]
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await createResults(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear los resultados del juego" })
            })
            it("should return error if body is empty", async () => {
                const req = {
                    body: []
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await createResults(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Tiene que haber al menos un resutlado" })
            })
        })
    })

    describe("Get game results by user", () => {
        describe("there are at least one result", () => {
            let user2: Prisma.userUncheckedCreateInput = {
                id: 2,
                username: "test2",
                password: "test",
                role: role.student,
            }
            let question: Prisma.questionUncheckedCreateInput = {
                id: 1,
                description: "test1",
                subject: "test1",
                type: type.multioption,
                answer_time: 5,
                user_creator_id: 1,
                resource: null,
            }
            let answer: Prisma.answerUncheckedCreateInput = {
                id: 1,
                question_id: question.id!,
                description: "test",
                is_correct: true
            }
            let gameResult: Prisma.gameResultUncheckedCreateInput = {
                user_id: user.id!,
                game_id: game.id!,
                score: 10
            }
            let answerResult: Prisma.answerResultUncheckedCreateInput = {
                user_id: user.id!,
                game_id: game.id!,
                answer_id: answer.id!,
                question_id: question.id!,
                question_index: 1,
                answered: true
            }
            beforeAll(async () => {
                await prisma.user.createMany({ data: [user, user2] })
                await prisma.question.create({ data: question })
                await prisma.answer.create({ data: answer })
                await prisma.survey.create({ data: survey1 })
                await prisma.game.create({ data: game })
                await prisma.gameResult.create({ data: gameResult })
                await prisma.answerResult.create({ data: answerResult })
            })
            afterAll(async () => {
                await prisma.answerResult.deleteMany({ where: { game_id: game.id } })
                await prisma.gameResult.deleteMany({ where: { game_id: game.id } })
                await prisma.game.delete({ where: { id: game.id } })
                await prisma.survey.delete({ where: { id: survey1.id } })
                await prisma.question.delete({ where: { id: question.id } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })
            it("should retrive the results with the user id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getGamesResultsByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([{
                    game_id: game.id,
                    user_id: user.id,
                    score: 10,
                    answer_results: [{
                        answer_id: answer.id,
                        answered: answerResult.answered,
                        game_id: game.id,
                        question_id: question.id,
                        question_index: answerResult.question_index,
                        short_answer: null,
                        user_id: user.id,
                        answer: {
                            id: answer.id,
                            is_correct: answer.is_correct,
                            question_id: question.id,
                            description: answer.description
                        },
                    }],
                    game: {
                        are_questions_visible: game.are_questions_visible,
                        host_id: game.host_id,
                        id: game.id,
                        point_type: game.point_type,
                        state: game.state,
                        survey: {
                            id: survey1.id,
                            questionsSurvey: [],
                            resource: null,
                            title: survey1.title,
                            user_creator_id: user.id
                        }
                    }
                }])
            })
        })
        describe("There are no results", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
            })
            afterAll(async () => {
                await prisma.user.delete({ where: { id: user.id } })
            })
            it("should retrive an empty array", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getGamesResultsByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([])
            })
        })
        describe("When providing an invalid user id", () => {
            describe("Should return error", () => {
                it("400 with no id", async () => {
                    const req = {
                        params: {}
                    }
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getGamesResultsByUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(400);
                    expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                });

                it("400 with invalid id", async () => {
                    const req = {
                        params: {
                            id: "invalid"
                        }
                    }
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getGamesResultsByUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(400);
                    expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                });

                it("404 user not exists", async () => {
                    const req = {
                        params: {
                            id: 1
                        }
                    }
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getGamesResultsByUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El usuario especificado no existe" });
                });
            })

        })
    })
})