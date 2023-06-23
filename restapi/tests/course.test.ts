import { Prisma, PrismaClient, role, type } from "@prisma/client"
import * as sinon from "ts-sinon"
import FormData from "form-data";
import * as fs from 'fs';
import prisma from "../prisma/prismaClient";
const MockExpressRequest = require('mock-express-request');

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    importCourses,
    addUsers,
    addSurveys,
    getCoursesByUser,
    addQuestions
} = require('../controllers/courseController')

let course1: Prisma.courseUncheckedCreateInput = {
    id: 1,
    name: "test1",
    description: "test1"
}
let course2: Prisma.courseUncheckedCreateInput = {
    id: 2,
    name: "test2",
    description: "test2"
}
let course3: Prisma.courseUncheckedCreateInput = {
    id: 3,
    name: "test3",
    description: "test3"
}

describe("Courses", () => {
    describe("Get courses", () => {
        describe("Exist courses", () => {
            beforeEach(async () => {
                await prisma.course.createMany({ data: [course1, course2, course3] })
            })

            afterEach(async () => {
                await prisma.course.deleteMany({ where: { name: { startsWith: "test" } } })
            })

            it("should retrieve all courses", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                await getCourses(null, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, [course1, course2, course3]);
            })
        })
        describe("Not exist courses", () => {
            it("should retrieve an empty array", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                await getCourses(null, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, []);
            })
        })
    })

    describe("Get course by id", () => {
        describe("there are at least one course", () => {
            beforeEach(async () => {
                await prisma.course.create({ data: course1 })
            })

            afterEach(async () => {
                await prisma.course.deleteMany({ where: { name: { startsWith: "test" } } })
            })

            it("should retrive the course with the id given", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getCourse(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith(course1)
            })
        })
        describe("There are no courses", () => {
            it("should retrive null", async () => {
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                const req = {
                    params: {
                        id: 2
                    }
                }
                await getCourse(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith(null)
            })
        })
    })

    describe("Create course", () => {
        describe("With valid input data", () => {
            afterEach(async () => {
                await prisma.course.deleteMany({ where: { name: { startsWith: "test" } } })
            })
            it("Course created successfully", async () => {
                const req = {
                    body: {
                        name: "test",
                        description: "test",
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso ha sido creado correctamente" });
                const courseCreated = await prisma.course.findFirst({ where: { name: "test" } })
                expect(courseCreated).not.toBeNull()
                expect(courseCreated?.name).toBe(req.body.name)
                expect(courseCreated?.description).toBe(req.body.description)
            });
        })

        describe("The course already exists", () => {

            beforeEach(async () => {
                await prisma.course.create({ data: course1 })
            })

            afterEach(async () => {
                await prisma.course.deleteMany({ where: { name: { startsWith: "test" } } })
            })

            it("should return a 400", async () => {
                const req = {
                    body: {
                        id: course1.id,
                        name: course1.name,
                        description: course1.description
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Ya existe un curso con ese nombre" });
            });
        })

        describe("Try to create a course with wrong fields", () => {
            describe('With emtpy field', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            description: "test"
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el curso" });
                });
            })
            describe('With wrong data types', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            name: 123,
                            description: 1234
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el curso" });
                })
            })
        })
    })

    describe("Update course", () => {
        describe("Course exists", () => {
            beforeEach(async () => {
                await prisma.course.create({ data: course1 })
            })
            afterEach(async () => {
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            it("should update name and description", async () => {
                const req = {
                    body: {
                        id: 1,
                        name: "newName",
                        description: "newDescription",
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso ha sido modificado correctamente" });
                const courseModified = await prisma.course.findFirst({ where: { id: 1 } })
                expect(courseModified?.name).toBe(req.body.name)
                expect(courseModified?.description).toBe(req.body.description)
            })

            it("should update with existing values with empty values", async () => {
                const req = {
                    body: {
                        id: 1,
                        name: "",
                        description: "",
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso ha sido modificado correctamente" });
                const courseModified = await prisma.course.findFirst({ where: { id: 1 } })
                expect(courseModified?.name).toBe(course1.name)
                expect(courseModified?.description).toBe(course1.description)
            })
        })

        describe("Course not exists", () => {
            it("should return 404", async () => {
                const req = {
                    body: {
                        id: 999,
                        name: "newUsername",
                        description: "",
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
            });
        })
    })

    describe("Delete course", () => {
        describe("Exists course", () => {
            beforeAll(async () => {
                await prisma.course.create({ data: course1 })
            })

            it("should delete with valid id", async () => {
                const req = { params: { id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "El curso ha sido eliminado correctamente" });
                const result = await prisma.course.findFirst({ where: { id: 1 } })
                expect(result).toBeNull()
            })
        })

        describe("Failure", () => {
            describe("Course not exists", () => {
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
                    await deleteCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no ha sido encontrado" });
                });
            })

            describe("When providing an invalid id", () => {
                describe("Should return 400", () => {
                    it("with no id", async () => {
                        const mockReq = { params: {} };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteCourse(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
                    });

                    it("with invalid id", async () => {
                        const mockReq = { params: { id: "invalid" } };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteCourse(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
                    });
                })

            })

        })

    })

    describe("Import courses", () => {
        describe("Valid csv file", () => {
            afterEach(async () => {
                await prisma.course.deleteMany({ where: { name: { startsWith: "test" } } })
            })
            it("File is uploaded and courses are successfully created", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/course_test.csv')
                );
                const req = new MockExpressRequest({
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/course/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({ message: "Cursos creados correctamente" })
                const coursesCreated = await prisma.course.findMany({ where: { name: { startsWith: "test" } } })
                expect(coursesCreated.length).toBe(3)
                expect(coursesCreated[0].name).toBe("test1")
                expect(coursesCreated[0].description).toBe("test1")
                expect(coursesCreated[1].name).toBe("test2")
                expect(coursesCreated[1].description).toBe("test2")
                expect(coursesCreated[2].name).toBe("test3")
                expect(coursesCreated[2].description).toBe("test3")
            })
        })

        describe("Invalid file", () => {
            it("should return 500 if empty file", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/empty.csv')
                );
                const req = new MockExpressRequest({
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/course/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "El fichero no puede estar vacío" })
            })
            it("should return 500 if file has an invalid format", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/invalid_format.csv')
                );
                const req = new MockExpressRequest({
                    method: 'POST',
                    host: 'localhost',
                    url: '/api/course/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al importar los cursos" })
            })

            it("should return 500 if file has missing fields", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/course_missing_fields.csv')
                );
                const req = new MockExpressRequest({
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
                await importCourses(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "No puede haber campos vacíos" })
            })
        })
    })

    describe('Add users to course', () => {
        let user1: Prisma.userUncheckedCreateInput = {
            id: 1,
            username: "test1",
            password: "test",
            role: role.student,
        }
        let user2: Prisma.userUncheckedCreateInput = {
            id: 2,
            username: "test2",
            password: "test",
            role: role.student,
        }
        describe("Users can be added", () => {
            beforeAll(async () => {
                await prisma.user.createMany({ data: [user1, user2] })
                await prisma.course.create({ data: course1 })
            })
            afterAll(async () => {
                await prisma.userCourse.deleteMany({ where: { course_id: 1 } })
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            it("users should be added to the course", async () => {
                const req = {
                    body: {
                        course_id: 1,
                        users: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await addUsers(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Los usuarios han sido añadidos correctamente" });
                const result = await prisma.userCourse.findMany({ where: { course_id: 1 } })
                expect(result.length).toBe(2)
            })
        })
        describe("Users can't be added", () => {
            describe("Users array is empty", () => {
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            users: []
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addUsers(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Debe haber al menos un usuario" });
                })
            })
            describe("Course does not exist", () => {
                beforeAll(async () => {
                    await prisma.user.createMany({ data: [user1, user2] })
                })
                afterAll(async () => {
                    await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            users: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addUsers(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
                })
            })
            describe("At least one user does not exist", () => {
                beforeAll(async () => {
                    await prisma.course.create({ data: course1 })
                })
                afterAll(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            users: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addUsers(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "Los usuarios especificados no existen" });
                })
            })
        })
    })

    describe('Add surveys to course', () => {
        let survey1: Prisma.surveyUncheckedCreateInput = {
            id: 1,
            title: "test1",
        }
        let survey2: Prisma.surveyUncheckedCreateInput = {
            id: 2,
            title: "test2"
        }
        describe("Sruveys can be added", () => {
            beforeAll(async () => {
                await prisma.survey.createMany({ data: [survey1, survey2] })
                await prisma.course.create({ data: course1 })
            })
            afterAll(async () => {
                await prisma.courseSurvey.deleteMany({ where: { course_id: 1 } })
                await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            it("surveys should be added to the course", async () => {
                const req = {
                    body: {
                        course_id: 1,
                        surveys: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await addSurveys(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Los cuestionarios han sido añadidos correctamente" });
                const result = await prisma.courseSurvey.findMany({ where: { course_id: 1 } })
                expect(result.length).toBe(2)
            })
        })
        describe("Surveys can't be added", () => {
            describe("Surveys array is empty", () => {
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            surveys: []
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addSurveys(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Debe haber al menos un cuestionario" });
                })
            })
            describe("Course does not exist", () => {
                beforeAll(async () => {
                    await prisma.survey.createMany({ data: [survey1, survey2] })
                })
                afterAll(async () => {
                    await prisma.survey.deleteMany({ where: { title: { startsWith: "test" } } })
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            surveys: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addSurveys(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
                })
            })
            describe("At least one survey does not exist", () => {
                beforeAll(async () => {
                    await prisma.course.create({ data: course1 })
                })
                afterAll(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            surveys: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addSurveys(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "Los cuestionarios especificados no existen" });
                })
            })
        })
    })

    describe('Add questions to course', () => {
        let question1: Prisma.questionUncheckedCreateInput = {
            id: 1,
            description: "test1",
            subject: "test1",
            type: type.multioption,
            answer_time: 5,
            user_creator_id: 1
        }
        let question2: Prisma.questionUncheckedCreateInput = {
            id: 2,
            description: "test2",
            subject: "test2",
            type: type.short,
            answer_time: 5,
            user_creator_id: 1
        }
        let user: Prisma.userUncheckedCreateInput = {
            id: 1,
            username: "test",
            password: "test",
            role: role.professor
        }
        describe("Questions can be added", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: user })
                await prisma.question.createMany({ data: [question1, question2] })
                await prisma.course.create({ data: course1 })
            })
            afterAll(async () => {
                await prisma.courseQuestion.deleteMany({ where: { course_id: 1 } })
                await prisma.question.deleteMany({ where: { description: {startsWith: "test"}} })
                await prisma.course.deleteMany({ where: { id: 1 } })
                await prisma.user.deleteMany({ where: { id: 1 } })
            })
            it("questions should be added to the course", async () => {
                const req = {
                    body: {
                        course_id: 1,
                        questions: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await addQuestions(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas han sido añadidas correctamente" });
                const result = await prisma.courseQuestion.findMany({ where: { course_id: 1 } })
                expect(result.length).toBe(2)
            })
        })
        describe("Questions can't be added", () => {
            describe("Questions array is empty", () => {
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            questions: []
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addQuestions(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Debe haber al menos una pregunta" });
                })
            })
            describe("Course does not exist", () => {
                beforeAll(async () => {
                    await prisma.user.create({ data: user })
                    await prisma.question.createMany({ data: [question1, question2] })
                })
                afterAll(async () => {
                    await prisma.question.deleteMany({ where: { description: { startsWith: "test" } } })
                    await prisma.user.deleteMany({ where: { id: 1 }})
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            questions: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addQuestions(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
                })
            })
            describe("At least one question does not exist", () => {
                beforeAll(async () => {
                    await prisma.course.create({ data: course1 })
                })
                afterAll(async () => {
                    await prisma.course.deleteMany({ where: { id: 1 } })
                })
                it("should return an error", async () => {
                    const req = {
                        body: {
                            course_id: 1,
                            questions: [{ id: 1 }, { id: 2 }]
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await addQuestions(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "Las preguntas especificadas no existen" });
                })
            })
        })
    })

    describe("Get all users's course", () => {
        const user: Prisma.userUncheckedCreateInput = {
            id: 1,
            username: "test",
            password: "test",
            role: role.student,
        }
        const userCourse1: Prisma.UserCourseUncheckedCreateInput = {
            course_id: course1.id!,
            user_id: user.id!
        }
        const userCourse2: Prisma.UserCourseUncheckedCreateInput = {
            course_id: course2.id!,
            user_id: user.id!
        }
        describe("Valid user id", () => {
            describe("User has no courses", () => {
                beforeEach(async () => {
                    await prisma.user.create({ data: user })
                })
                afterEach(async () => {
                    await prisma.user.deleteMany({ where: { id: 1 } })
                })
                it("should return an empty array", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getCoursesByUser(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([]);
                })
            })
            describe("User has courses", () => {
                beforeEach(async () => {
                    await prisma.course.createMany({ data: [course1, course2] })
                    await prisma.user.create({ data: user })
                    await prisma.userCourse.createMany({ data: [userCourse1, userCourse2] })
                })
                afterEach(async () => {
                    await prisma.user.deleteMany({ where: { id: 1 } })
                    await prisma.course.deleteMany({ where: { name: {startsWith: "test"} } })
                    await prisma.userCourse.deleteMany({ where: { user_id: 1 } })
                })
                it("should retrieve all user's courses giving user id", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getCoursesByUser(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([course1, course2]);
                })
            })

        })

        describe("Invalid user id", () => {
            it("should return 400 when user id is not a number", async () => {
                const req = { params: { id: "not a number" } };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getCoursesByUser(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" })
            })

            it("should return 400 when user id is not provided", async () => {
                const req = { params: {} };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getCoursesByUser(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
            })
        })

    })

})