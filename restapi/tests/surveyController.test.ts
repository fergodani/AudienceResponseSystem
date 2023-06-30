import { Prisma, role, type } from "@prisma/client"
import prisma from "../prisma/prismaClient"

const {
    getSurveys,
    createSurvey,
    getSurveysByUser,
    getSurveysByCourse,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    deleteSurveyFromCourse
} = require('../controllers/surveyController')

let survey1: Prisma.surveyUncheckedCreateInput = {
    id: 1,
    title: "test1",
    user_creator_id: 1
}
let survey2: Prisma.surveyUncheckedCreateInput = {
    id: 2,
    title: "test2",
    user_creator_id: 1
}
let survey3: Prisma.surveyUncheckedCreateInput = {
    id: 3,
    title: "test2",
    user_creator_id: 2
}
let user: Prisma.userUncheckedCreateInput = {
    id: 1,
    username: "test",
    password: "test",
    role: role.professor
}
let user2: Prisma.userUncheckedCreateInput = {
    id: 2,
    username: "test1",
    password: "test",
    role: role.professor
}
let question1: Prisma.questionUncheckedCreateInput = {
    id: 1,
    description: "test1",
    subject: "test1",
    type: type.multioption,
    answer_time: 5,
    user_creator_id: 1,
    resource: null,
}
let question2: Prisma.questionUncheckedCreateInput = {
    id: 2,
    description: "test2",
    subject: "test2",
    type: type.short,
    answer_time: 5,
    resource: null,
    user_creator_id: 1,
}


describe("Surveys", () => {
    describe("Get surveys", () => {
        describe("Exist surveys", () => {
            beforeEach(async () => {
                await prisma.user.createMany({ data: [user, user2] })
                await prisma.survey.createMany({ data: [survey1, survey2, survey3] })
            })

            afterEach(async () => {
                await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })

            it("should retrieve all surveys", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await getSurveys(null, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([{
                    id: survey1.id,
                    title: survey1.title,
                    user_creator_id: survey1.user_creator_id,
                    questionsSurvey: []
                }, {
                    id: survey2.id,
                    title: survey2.title,
                    user_creator_id: survey2.user_creator_id,
                    questionsSurvey: []
                }, {
                    id: survey3.id,
                    title: survey3.title,
                    user_creator_id: survey3.user_creator_id,
                    questionsSurvey: []
                }])
            })
        })
        describe("Not exist surveys", () => {
            it("should retrieve an empty array", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await getSurveys(null, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([])
            })
        })
    })

    describe("Get surveys by user", () => {
        describe("there are at least one survey", () => {
            beforeEach(async () => {
                await prisma.user.createMany({ data: [user, user2] })
                await prisma.survey.createMany({ data: [survey1, survey2, survey3] })
            })

            afterEach(async () => {
                await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })

            it("should retrive the surveys with the user id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getSurveysByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([{
                    id: survey1.id,
                    title: survey1.title,
                    user_creator_id: survey1.user_creator_id,
                    questionsSurvey: [],
                    resource: null
                }, {
                    id: survey2.id,
                    title: survey2.title,
                    user_creator_id: survey1.user_creator_id,
                    questionsSurvey: [],
                    resource: null
                }])
            })
        })
        describe("There are no surveys", () => {
            it("should retrive an emtpy array", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getSurveysByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([])
            })
        })
        describe("When providing an invalid id", () => {
            describe("Should return 400", () => {
                it("with no id", async () => {
                    const mockReq = { params: {} };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getSurveysByUser(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                });

                it("with invalid id", async () => {
                    const mockReq = { params: { id: "invalid" } };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getSurveysByUser(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                });
            })

        })
    })

    describe("Get survey by id", () => {
        describe("there are at least one survey", () => {
            beforeEach(async () => {
                await prisma.user.createMany({ data: [user, user2] })
                await prisma.survey.createMany({ data: [survey1, survey2, survey3] })
            })

            afterEach(async () => {
                await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })

            it("should retrive the survey with the id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getSurveyById(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({
                    id: survey1.id,
                    title: survey1.title,
                    user_creator_id: survey1.user_creator_id,
                    questionsSurvey: [],
                    resource: null
                })
            })
        })
        describe("There are no surveys", () => {
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
                await getSurveyById(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith(null)
            })
        })
        describe("When providing an invalid id", () => {
            describe("Should return 400", () => {
                it("with no id", async () => {
                    const mockReq = { params: {} };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getSurveyById(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de cuestionario válido" });
                });

                it("with invalid id", async () => {
                    const mockReq = { params: { id: "invalid" } };
                    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await getSurveyById(mockReq, mockRes);
                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de cuestionario válido" });
                });
            })

        })
    })

    describe("Get all course's surveys", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const courseSurvey1: Prisma.courseSurveyUncheckedCreateInput = {
            course_id: course.id!,
            survey_id: survey1.id!
        }
        const courseSurvey2: Prisma.courseSurveyUncheckedCreateInput = {
            course_id: course.id!,
            survey_id: survey2.id!
        }
        describe("Valid course id", () => {
            describe("Course has no surveys", () => {
                beforeEach(async () => {
                    await prisma.course.create({ data: course })
                })
                afterEach(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                })
                it("should return an empty array", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getSurveysByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([]);
                })
            })
            describe("Course has surveys", () => {
                beforeEach(async () => {
                    await prisma.user.create({ data: user })
                    await prisma.survey.createMany({ data: [survey1, survey2] })
                    await prisma.course.create({ data: course })
                    await prisma.courseSurvey.createMany({ data: [courseSurvey1, courseSurvey2] })
                })
                afterEach(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                    await prisma.courseSurvey.deleteMany({ where: { course_id: 1 } })
                    await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                    await prisma.user.deleteMany({ where: { id: user.id } })
                })
                it("should retrieve all course's surveys giving course id", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getSurveysByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([{
                        id: survey1.id,
                        title: survey1.title,
                        user_creator_id: survey1.user_creator_id,
                        questionsSurvey: [],
                        resource: null
                    }, {
                        id: survey2.id,
                        title: survey2.title,
                        user_creator_id: survey2.user_creator_id,
                        questionsSurvey: [],
                        resource: null
                    }]);
                })
            })

        })

        describe("Invalid course id", () => {
            it("should return 400 when course id is not a number", async () => {
                const req = { params: { id: "not a number" } };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getSurveysByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" })
            })

            it("should return 400 when course id is not provided", async () => {
                const req = { params: {} };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getSurveysByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
            })
        })

    })

    describe("Create survey", () => {
        describe("With valid input data", () => {
            describe("User creator exists", () => {
                beforeAll(async () => {
                    await prisma.user.create({ data: user })
                    await prisma.question.createMany({ data: [question1, question2] })
                })
                afterAll(async () => {
                    await prisma.question.deleteMany({ where: { description: { startsWith: 'test' } } })
                    await prisma.survey.deleteMany({ where: { title: 'newSurvey' } })
                    await prisma.user.deleteMany({ where: { username: "test" } })
                })
                it("Survey created successfully", async () => {
                    const req = {
                        body: {
                            title: "newSurvey",
                            user_creator_id: 1,
                            resource: "",
                            questions: [{
                                id: 1,
                                position: 1
                            },
                            {
                                id: 2,
                                position: 2
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario ha sido creado correctamente" });
                    const surveyCreated = await prisma.survey.findFirst({ where: { title: "newSurvey" } })
                    expect(surveyCreated).not.toBeNull()
                });
            })
            describe("User creator does not exist", () => {
                it("should return error", async () => {
                    const req = {
                        body: {
                            title: "newSurvey",
                            user_creator_id: 1,
                            resource: "",
                            questions: [{
                                id: 1,
                                position: 1
                            },
                            {
                                id: 2,
                                position: 2
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El usuario especificado no existe" });
                })
            })

        })

        describe("Try to create a user with wrong fields", () => {
            describe('With missing field', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            questions: [{
                                id: 1,
                                position: 1
                            },
                            {
                                id: 2,
                                position: 2
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Se deben proporcionar todos los camos requeridos" });
                });
            })
            describe('With wrong data types', () => {
                beforeAll(async () => {
                    await prisma.user.create({data: user})
                })
                afterAll(async () => {
                    await prisma.user.deleteMany({where: {id: user.id}})
                })
                it("should return 500", async () => {
                    const req = {
                        body: {
                            title: 2135,
                            user_creator_id: 1,
                            resource: "",
                            questions: [{
                                id: 1,
                                position: 1
                            },
                            {
                                id: 2,
                                position: 2
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el cuestionario" });
                })
            })
            describe("Without any question attached", () => {
                it("should return an error", async () => {
                    const req = {
                        body: {
                            title: "newSurvey",
                            user_creator_id: 1,
                            resource: "",
                            questions: []
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario debe tener al menos una pregunta" });
                })

            })
        })
    })

    describe("Update survey", () => {
        describe("Survey exists", () => {
            let question3: Prisma.questionUncheckedCreateInput = {
                id: 3,
                description: "test3",
                subject: "test3",
                type: type.short,
                answer_time: 5,
                resource: null,
                user_creator_id: 1,
            }
            let questionSurvey1: Prisma.questionSurveyUncheckedCreateInput = {
                question_id: 1,
                survey_id: 1,
                position: 1
            }
            beforeEach(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.createMany({ data: [question1, question2, question3] })
                await prisma.survey.create({data: survey1})
                await prisma.questionSurvey.create({data: questionSurvey1})
            })
            afterEach(async () => {
                await prisma.question.deleteMany({ where: { description: {startsWith: "test"} } })
                await prisma.survey.delete({where: {id: survey1.id}})
                await prisma.user.deleteMany({ where: { id: user.id } })
            })
            it("should update title and questions", async () => {
                const req = {
                    body: {
                        id: 1,
                        title: "newTitle",
                        questions: [{
                            id: 2,
                            position: 2
                        },
                        {
                            id: 3,
                            position: 1
                        }]
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateSurvey(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Cuestionario actualizado correctamente" });
                const surveyModified = await prisma.survey.findFirst({
                    where: { id: 1 },
                    select: {
                        title: true,
                        questionsSurvey: true
                    }
                })
                expect(surveyModified?.title).toBe("newTitle")
                expect(surveyModified?.questionsSurvey.length).toBe(2)

            })
            
            it("should return error if there is no questions", async () => {
                const req = {
                    body: {
                        id: 1,
                        title: "newTitle",
                        questions: []
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateSurvey(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario debe tener al menos una pregunta" });
            })

        })

        describe("Survey not exists", () => {
            it("should return 404", async () => {
                const req = {
                    body: {
                        id: 999,
                        title: "newTitle",
                        questions: [{
                            id: 2,
                            position: 2
                        },
                        {
                            id: 3,
                            position: 1
                        }]
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateSurvey(req, res);
                expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario especificado no existe" });
                expect(res.status).toHaveBeenCalledWith(404);
                
            });
        })
    })

    describe("Delete survey", () => {
        describe("Exists survey", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.createMany({ data: [question1, question2] })
                await prisma.survey.create({data: survey1})
            })
            afterAll(async () => {
                await prisma.question.deleteMany({where: { description: { startsWith: "test"}}})
                await prisma.user.deleteMany({ where: { id: 1 } })
            })

            it("should delete the survey", async () => {
                const req = { params: { id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteSurvey(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Cuestionario eliminado correctamente" });
                const surveyResult = await prisma.survey.findFirst({ where: { id: 1 } })
                expect(surveyResult).toBeNull()
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
                    await deleteSurvey(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario especificado no existe" });
                });
            })

            describe("When providing an invalid id", () => {
                describe("Should return 400", () => {
                    it("with no id", async () => {
                        const mockReq = { params: {} };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteSurvey(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de cuestionario válido" });
                    });

                    it("with invalid id", async () => {
                        const mockReq = { params: { id: "invalid" } };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteSurvey(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de cuestionario válido" });
                    });
                })

            })

        })

    })

    describe("Delete surveys from course", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const courseSurvey: Prisma.courseSurveyUncheckedCreateInput = {
            course_id: course.id!,
            survey_id: survey1.id!
        }
        describe("With valid parameters", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.survey.create({ data: survey1 })
                await prisma.course.create({ data: course })
            })
            afterAll(async () => {
                await prisma.survey.deleteMany({ where: { id: 1 } })
                await prisma.user.deleteMany({ where: { id: 1 } })
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            describe("User belongs to course", () => {
                beforeEach(async () => {
                    await prisma.courseSurvey.create({ data: courseSurvey })
                })
                it("should delete the question form course", async () => {
                    const req = { params: { course_id: "1", survey_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteSurveyFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith({ message: "Cuestionario eliminado del curso correctamente" });
                });
            })
            describe("Survey does not belong to course", () => {
                it("should return an error", async () => {
                    const req = { params: { course_id: "1", survey_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteSurveyFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el cuestionario del curso" });
                })
            })
        })
        describe("With invalid parameters", () => {
            it("should return 500 if course id is not a number", async () => {
                const req = { params: { course_id: "not_a_number", survey_id: "1" } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteSurveyFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el cuestionario del curso" });
            });
            it("should return 404 if course does not exist", async () => {
                const req = { params:{ course_id: 1, survey_id: survey1.id } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteSurveyFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
            });
            describe("Course does exists", () => {
                beforeAll(async () => {
                    await prisma.course.create({data: course})
                })
                afterAll(async () => {
                    await prisma.course.delete({where: {id: course.id}})
                })
                it("should return 404 if survey does not exist", async () => {
                    const req = { params:{ course_id: 1, survey_id: survey1.id } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteSurveyFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El cuestionario especificado no existe" });
                });
                it("should return 500 if survey id is not a number", async () => {
                    const req = { params: { course_id: "1", survey_id: "not_a_number" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteSurveyFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el cuestionario del curso" });
                })
            })
        })
    })
})