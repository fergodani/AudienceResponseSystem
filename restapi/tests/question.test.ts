import { Prisma, role, type } from "@prisma/client"
import * as sinon from "ts-sinon"
import prisma from "../prisma/prismaClient"
import FormData from "form-data";
import * as fs from 'fs';
const MockExpressRequest = require('mock-express-request');

const {
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
} = require('../controllers/questionController')

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
let question3: Prisma.questionUncheckedCreateInput = {
    id: 3,
    description: "test3",
    subject: "test3",
    type: type.short,
    answer_time: 5,
    user_creator_id: 1,
    resource: null,
}
let user: Prisma.userUncheckedCreateInput = {
    id: 1,
    username: "test",
    password: "test",
    role: role.professor
}

describe("Questions", () => {
    describe("Get questions", () => {
        describe("Exist questions", () => {
            beforeEach(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.createMany({ data: [question1, question2, question3] })
            })

            afterEach(async () => {
                await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })

            it("should retrieve all questions", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await getQuestions(null, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([{
                    id: question1.id,
                    description: question1.description,
                    subject: question1.subject,
                    type: question1.type,
                    answer_time: question1.answer_time,
                    user_creator_id: question1.user_creator_id,
                    resource: question1.resource,
                    answers: []
                }, {
                    id: question2.id,
                    description: question2.description,
                    subject: question2.subject,
                    type: question2.type,
                    answer_time: question2.answer_time,
                    user_creator_id: question2.user_creator_id,
                    resource: question2.resource,
                    answers: []
                }, {
                    id: question3.id,
                    description: question3.description,
                    subject: question3.subject,
                    type: question3.type,
                    answer_time: question3.answer_time,
                    user_creator_id: question3.user_creator_id,
                    resource: question3.resource,
                    answers: []
                }])
            })
        })
        describe("Not exist questions", () => {
            it("should retrieve an empty array", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                await getQuestions(null, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, []);
            })
        })
    })

    describe("Get question by id", () => {
        describe("there are at least one question", () => {
            beforeEach(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.create({ data: question1 })
            })

            afterEach(async () => {
                await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })

            it("should retrive the question with the id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getQuestionById(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({
                    id: question1.id,
                    description: question1.description,
                    subject: question1.subject,
                    type: question1.type,
                    answer_time: question1.answer_time,
                    user_creator_id: question1.user_creator_id,
                    resource: question1.resource,
                    answers: []
                })
            })
        })
        describe("There are no questions", () => {
            it("should retrive null", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                const req = {
                    params: {
                        id: 2
                    }
                }
                await getQuestionById(req, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, null);
            })
        })
    })

    describe("Get question by user", () => {
        describe("there are at least one question", () => {
            beforeEach(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.createMany({ data: [question1, question2] })
            })

            afterEach(async () => {
                await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })

            it("should retrive the questions with the id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getQuestionsByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([{
                    id: question1.id,
                    description: question1.description,
                    subject: question1.subject,
                    type: question1.type,
                    answer_time: question1.answer_time,
                    user_creator_id: question1.user_creator_id,
                    resource: question1.resource,
                    answers: []
                }, {
                    id: question2.id,
                    description: question2.description,
                    subject: question2.subject,
                    type: question2.type,
                    answer_time: question2.answer_time,
                    user_creator_id: question2.user_creator_id,
                    resource: question2.resource,
                    answers: []
                }])
            })
        })
        describe("There are no questions", () => {
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
                await getQuestionsByUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith([])
            })
        })
    })

    describe("Create question", () => {
        describe("With valid input data", () => {
            describe("User creator exists", () => {
                beforeEach(async () => {
                    await prisma.user.create({ data: user })
                })
                afterEach(async () => {
                    await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                    await prisma.user.deleteMany({ where: { id: 1 } })
                })
                it("Question created successfully", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 5,
                            user_creator_id: 1,
                            resource: null,
                            answers: [
                                {
                                    description: "test1",
                                    is_correct: true
                                },
                                {
                                    description: "test2",
                                    is_correct: false
                                },
                                {
                                    description: "test3",
                                    is_correct: false
                                },
                                {
                                    description: "test4",
                                    is_correct: false
                                }
                            ]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith({ message: "La pregunta ha sido creada correctamente" });
                    const questionCreated = await prisma.question.findFirst({
                        where: { description: "test1" }, select: {
                            description: true,
                            subject: true,
                            type: true,
                            answer_time: true,
                            resource: true,
                            user_creator_id: true,
                            answers: {
                                select: {
                                    description: true,
                                    is_correct: true
                                }
                            }
                        }
                    })
                    expect(questionCreated).not.toBeNull()
                    expect(questionCreated).toStrictEqual(req.body)
                    expect(questionCreated?.answers.length).toBe(4)
                });
            })
            describe("User creator does not exist", () => {
                it("should return 404", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 5,
                            user_creator_id: 1,
                            resource: null,
                            answers: [
                                {
                                    description: "test1",
                                    is_correct: true
                                },
                                {
                                    description: "test2",
                                    is_correct: false
                                },
                                {
                                    description: "test3",
                                    is_correct: false
                                },
                                {
                                    description: "test4",
                                    is_correct: false
                                }
                            ]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El usuario no existe" });
                });
            })
        })

        describe("Try to create a question with wrong fields", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
            })
            afterAll(async () => {
                await prisma.user.deleteMany({ where: { id: 1 } })
            })
            it("should return 500 if any field is undefined", async () => {
                const req = {
                    body: {
                        description: "test"
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Se deben proveer todos los campos necesarios" });
            });
            it("should return 500 if questions has no answers", async () => {
                const req = {
                    body: {
                        description: "test1",
                        subject: "test1",
                        type: type.multioption,
                        answer_time: 2,
                        user_creator_id: user.id,
                        resource: null,
                        answers: []
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "La pregunta debe tener respuestas" });
            })
            it("should return 500 if answer time is less than 5 seconds", async () => {
                const req = {
                    body: {
                        description: "test1",
                        subject: "test1",
                        type: type.multioption,
                        answer_time: 2,
                        user_creator_id: user.id,
                        resource: null,
                        answers: [{
                            description: "test1",
                            is_correct: true
                        },
                        {
                            description: "test1",
                            is_correct: true
                        }]
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "El tiempo de respuesta a una pregunta debe ser como mínimo de cinco segundos" });
            })
            describe('Multioption questions', () => {
                it("should return 500 if question has more than 4 answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test2",
                                is_correct: false
                            },
                            {
                                description: "test3",
                                is_correct: false
                            },
                            {
                                description: "test4",
                                is_correct: false
                            }
                                ,
                            {
                                description: "test4",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas de tipo multiopción han de tener cuatro respuestas" });
                });
                it("should return 500 if question has less than 4 answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas de tipo multiopción han de tener cuatro respuestas" });
                });
                it("should return 500 if more than one answer is correct", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test1",
                                is_correct: true
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Solo puede haber una respuesta correcta" });
                });
                it("should return 500 if any answer is correct", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Solo puede haber una respuesta correcta" });
                });
            })
            describe('True/false questions', () => {
                it("should return 500 if question has more than 2 answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.true_false,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test2",
                                is_correct: false
                            },
                            {
                                description: "test3",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas de tipo verdader o falso han de tener dos respuestas" });
                });
                it("should return 500 if question has less than 2 answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.true_false,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas de tipo verdader o falso han de tener dos respuestas" });
                });
                it("should return 500 if more than one answer is correct", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.true_false,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test1",
                                is_correct: true
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Solo puede haber una respuesta correcta" });
                });
                it("should return 500 if question has no correct answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.true_false,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Solo puede haber una respuesta correcta" });
                });
            })
            describe('Short questions', () => {
                it("should return 500 if question has more than 4 answers", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.short,
                            answer_time: 7,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            }, {
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas de tipo respuesta corta han de tener entre una y cuatro respuestas" });
                });
                it("should return 500 if not all answers are correct", async () => {
                    const req = {
                        body: {
                            description: "test1",
                            subject: "test1",
                            type: type.short,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: "",
                            answers: [{
                                description: "test1",
                                is_correct: false
                            },
                            {
                                description: "test1",
                                is_correct: true
                            }, {
                                description: "test1",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Todas las respuestas de las preguntas de tipo respuesta corta han de ser correctas" });
                });
            })
            describe('With wrong data types', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            description: 1234,
                            subject: "test1",
                            type: type.multioption,
                            answer_time: 6,
                            user_creator_id: user.id,
                            resource: null,
                            answers: [{
                                description: "test1",
                                is_correct: true
                            },
                            {
                                description: "test2",
                                is_correct: false
                            },
                            {
                                description: "test3",
                                is_correct: false
                            },
                            {
                                description: "test4",
                                is_correct: false
                            }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear la pregunta" });
                })
            })
        })
    })

    describe("Delete question", () => {
        describe("Exists question", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.create({ data: question1 })
            })
            afterAll(async () => {
                await prisma.user.deleteMany({ where: { id: 1 } })
            })

            it("should delete the question and all the answers with valid question id", async () => {
                const req = { params: { id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "La pregunta ha sido eliminada correctamente" });
                const questionResult = await prisma.course.findFirst({ where: { id: 1 } })
                const answerResult = await prisma.answer.findMany({
                    where: {
                        question_id: 1
                    }
                })
                expect(questionResult).toBeNull()
                expect(answerResult).toStrictEqual([])
            })
        })

        describe("Failure", () => {
            describe("Question not exists", () => {
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
                    await deleteQuestion(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "La pregunta especificada no ha sido encontrada" });
                });
            })

            describe("When providing an invalid id", () => {
                describe("Should return 400", () => {
                    it("with no id", async () => {
                        const mockReq = { params: {} };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteQuestion(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de pregunta válido" });
                    });

                    it("with invalid id", async () => {
                        const mockReq = { params: { id: "invalid" } };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteQuestion(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de pregunta válido" });
                    });
                })

            })

        })

    })

    describe("Import questions", () => {
        describe("Valid csv file", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
            })
            afterAll(async () => {
                await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })
            it("File is uploaded and questions are successfully created", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/question_test.csv')
                );
                const req = new MockExpressRequest({
                    params: {
                        id: 1
                    },
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/question/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importQuestions(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas se han creado correctamente" })
                const questionsCreated = await prisma.question.findMany({
                    select: {
                        description: true,
                        subject: true,
                        type: true,
                        answer_time: true,
                        answers: {
                            select: {
                                description: true,
                                is_correct: true
                            }
                        }
                    }
                })
                console.log(questionsCreated)
                expect(questionsCreated.length).toBe(3)
                expect(questionsCreated[0].description).toBe("test1")
                expect(questionsCreated[0].subject).toBe("test1")
                expect(questionsCreated[0].type).toBe("multioption")
                expect(questionsCreated[0].answer_time).toBe(10)
                expect(questionsCreated[0].answers[0].description).toBe("respuesta1")
                expect(questionsCreated[0].answers[0].is_correct).toBe(true)
                expect(questionsCreated[0].answers[1].description).toBe("respuesta2")
                expect(questionsCreated[0].answers[1].is_correct).toBe(false)
                expect(questionsCreated[0].answers[2].description).toBe("respuesta3")
                expect(questionsCreated[0].answers[2].is_correct).toBe(false)
                expect(questionsCreated[0].answers[3].description).toBe("respuesta4")
                expect(questionsCreated[0].answers[3].is_correct).toBe(false)

                expect(questionsCreated[1].description).toBe("test2")
                expect(questionsCreated[1].subject).toBe("test2")
                expect(questionsCreated[1].type).toBe("true_false")
                expect(questionsCreated[1].answer_time).toBe(10)
                expect(questionsCreated[1].answers[0].description).toBe("respuesta1")
                expect(questionsCreated[1].answers[0].is_correct).toBe(true)
                expect(questionsCreated[1].answers[1].description).toBe("respuesta2")
                expect(questionsCreated[1].answers[1].is_correct).toBe(false)

                expect(questionsCreated[2].description).toBe("test3")
                expect(questionsCreated[2].subject).toBe("test3")
                expect(questionsCreated[2].type).toBe("short")
                expect(questionsCreated[2].answer_time).toBe(10)
                expect(questionsCreated[2].answers[0].description).toBe("respuesta1")
                expect(questionsCreated[2].answers[0].is_correct).toBe(true)
                expect(questionsCreated[2].answers[1].description).toBe("respuesta2")
                expect(questionsCreated[2].answers[1].is_correct).toBe(true)
            })
        })

        describe("Invalid file", () => {
            it("should return 500 if empty file", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/empty.csv')
                );
                const req = new MockExpressRequest({
                    params: {
                        id: 1
                    },
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/question/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importQuestions(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "El fichero no puede estar vacío" })
            })
            it("should return 500 if file has an invalid format", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/invalid_format.csv')
                );
                const req = new MockExpressRequest({
                    params: {
                        id: 1
                    },
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/question/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importQuestions(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas no son válidas" })
            })

            it("should return 500 if file has missing fields", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/question_missing_fields.csv')
                );
                const req = new MockExpressRequest({
                    params: {
                        id: 1
                    },
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/user/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importQuestions(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "No puede haber campos vacíos" })
            })
        })
    })

    describe("Export questions", () => {
        describe("User exists", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
            })
            afterAll(async () => {
                await prisma.user.deleteMany({ where: { id: user.id } })
            })
            describe("User has no questions", () => {
                it("should return a empty csv if user does not have questions", async () => {
                    const req = { params: { id: 1 } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await exportQuestions(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalled();
                })
            })
            describe("User has at least one question", () => {
                beforeAll(async () => {
                    await prisma.question.createMany({ data: [question1, question2] })
                    await prisma.answer.createMany({
                        data: [
                            {
                                question_id: 1,
                                description: "test",
                                is_correct: true
                            },
                            {
                                question_id: 1,
                                description: "test",
                                is_correct: false
                            },
                            {
                                question_id: 2,
                                description: "test",
                                is_correct: true
                            },
                            {
                                question_id: 2,
                                description: "test",
                                is_correct: false
                            }
                        ]
                    })
                })
                afterAll(async () => {
                    await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                })
                it("should return a csv if users and questions exists", async () => {
                    const req = { params: { id: 1 } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await exportQuestions(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalled();
                });
            })

        })

        it("should return error if user does not exist", async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await exportQuestions(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "El usuario especificado no existe" });
        });
    })

    describe("Update question", () => {
        describe("Question exists", () => {
            beforeEach(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.create({ data: question1 })
            })
            afterEach(async () => {
                await prisma.question.deleteMany({ where: { id: 1 } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })
            it("should update description, type, time, and answers", async () => {
                const req = {
                    body: {
                        id: 1,
                        description: "newDescription",
                        subject: "newSubject",
                        type: type.true_false,
                        answer_time: 50,
                        answers: [
                            {
                                description: "newAnswer",
                                is_correct: false
                            },
                            {
                                description: "newAnswer1",
                                is_correct: true
                            }
                        ]
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Pregunta actualizada correctamente" });
                const questionModified = await prisma.question.findFirst({
                    where: { id: 1 },
                    select: {
                        description: true,
                        subject: true,
                        type: true,
                        answer_time: true,
                        answers: {
                            select: {
                                description: true,
                                is_correct: true
                            }
                        }
                    }
                })
                expect(questionModified?.description).toBe(req.body.description)
                expect(questionModified?.subject).toBe(req.body.subject)
                expect(questionModified?.type).toBe(req.body.type)
                expect(questionModified?.answer_time).toBe(req.body.answer_time)
                expect(questionModified?.answers.length).toBe(2)
                expect(questionModified?.answers[0].description).toBe("newAnswer")
                expect(questionModified?.answers[0].is_correct).toBe(false)
                expect(questionModified?.answers[1].description).toBe("newAnswer1")
                expect(questionModified?.answers[1].is_correct).toBe(true)
            })

            it("should update with existing values with empty values", async () => {
                const req = {
                    body: {
                        id: 1,
                        description: "",
                        subject: "",
                        type: '',
                        answer_time: '',
                        answers: [
                            {
                                description: "newAnswer",
                                is_correct: false
                            },
                            {
                                description: "newAnswer1",
                                is_correct: true
                            },
                            {
                                description: "newAnswer1",
                                is_correct: false
                            },
                            {
                                description: "newAnswer1",
                                is_correct: false
                            }
                        ]
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Pregunta actualizada correctamente" });
                const questionModified = await prisma.question.findFirst({
                    where: { id: 1 },
                    select: {
                        description: true,
                        subject: true,
                        type: true,
                        answer_time: true,
                        answers: {
                            select: {
                                description: true,
                                is_correct: true
                            }
                        }
                    }
                })
                expect(questionModified?.description).toBe(question1.description)
                expect(questionModified?.subject).toBe(question1.subject)
                expect(questionModified?.type).toBe(question1.type)
                expect(questionModified?.answer_time).toBe(question1.answer_time)
                expect(questionModified?.answers.length).toBe(4)
            })
            it("should return error if question has wrong format", async () => {
                const req = {
                    body: {
                        id: 1,
                        description: "",
                        subject: "",
                        type: '',
                        answer_time: '',
                        answers: [
                            {
                                description: "newAnswer",
                                is_correct: false
                            },
                            {
                                description: "newAnswer1",
                                is_correct: true
                            }
                        ]
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "El formato de la pregunta es incorrecto" });
            })
            it("should return error if answers is empty", async () => {
                const req = {
                    body: {
                        id: 1,
                        description: "",
                        subject: "",
                        type: '',
                        answer_time: '',
                        answers: []
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "La pregunta debe tener respuestas" });
            })

        })

        describe("Question not exists", () => {
            it("should return 404", async () => {
                const req = {
                    body: {
                        id: 999
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateQuestion(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: "Pregunta no encontrada" });
            });
        })
    })

    describe("Get all course's questions", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const courseQuestion1: Prisma.courseQuestionUncheckedCreateInput = {
            course_id: course.id!,
            question_id: question1.id!
        }
        const courseQuestion2: Prisma.courseQuestionUncheckedCreateInput = {
            course_id: course.id!,
            question_id: question2.id!
        }
        describe("Valid course id", () => {
            describe("Course has no questions", () => {
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
                    await getQuestionsByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([]);
                })
            })
            describe("Course has questions", () => {
                beforeEach(async () => {
                    await prisma.user.create({ data: user })
                    await prisma.question.createMany({ data: [question1, question2] })
                    await prisma.course.create({ data: course })
                    await prisma.courseQuestion.createMany({ data: [courseQuestion1, courseQuestion2] })
                })
                afterEach(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                    await prisma.courseQuestion.deleteMany({ where: { course_id: 1 } })
                    await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                    await prisma.user.deleteMany({ where: { id: user.id } })
                })
                it("should retrieve all course's questions giving course id", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getQuestionsByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([
                        {
                            id: question1.id,
                            description: question1.description,
                            type: question1.type,
                            answer_time: question1.answer_time,
                            subject: question1.subject,
                            resource: question1.resource,
                            answers: []
                        },
                        {
                            id: question2.id,
                            description: question2.description,
                            type: question2.type,
                            answer_time: question2.answer_time,
                            subject: question2.subject,
                            resource: question2.resource,
                            answers: []
                        }
                    ]);
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
                await getQuestionsByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" })
            })

            it("should return 400 when course id is not provided", async () => {
                const req = { params: {} };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getQuestionsByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
            })
        })

    })

    describe("Delete question from course", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const courseQuestion1: Prisma.courseQuestionUncheckedCreateInput = {
            course_id: course.id!,
            question_id: question1.id!
        }
        describe("With valid parameters", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.create({ data: question1 })
                await prisma.course.create({ data: course })
            })
            afterAll(async () => {
                await prisma.question.deleteMany({ where: { id: 1 } })
                await prisma.user.deleteMany({ where: { id: 1 } })
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            describe("User belongs to course", () => {
                beforeEach(async () => {
                    await prisma.courseQuestion.create({ data: courseQuestion1 })
                })
                it("should delete the question form course", async () => {
                    const req = { params: { course_id: "1", question_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteQuestionFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith({ message: "Pregunta eliminada del curso correctamente" });
                });
            })
            describe("Question does not belong to course", () => {
                it("should return an error", async () => {
                    const req = { params: { course_id: "1", question_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteQuestionFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar la pregunta del curso" });
                })
            })
        })
        describe("With invalid parameters", () => {
            it("should return 500 if question id is not a number", async () => {
                const req = { params: { course_id: "1", question_id: "not_a_number" } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteQuestionFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar la pregunta del curso" });
            })
            it("should return 500 if course id is not a number", async () => {
                const req = { params: { course_id: "not_a_number", question_id: "1" } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteQuestionFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar la pregunta del curso" });
            });
        })
    })

})