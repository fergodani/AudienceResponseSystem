import { Prisma, role } from "@prisma/client"
import * as sinon from "ts-sinon"
import FormData from "form-data";
import * as fs from 'fs';
import prisma from "../prisma/prismaClient";
const MockExpressRequest = require('mock-express-request');
const bcrypt = require("bcrypt");

const {
    getUsers,
    getUser,
    login,
    createUser,
    updateUser,
    deleteUser,
    importUsers,
    getUsersByCourse,
    changePassword,
    deleteUserFromCourse
} = require('../controllers/userController')

let savedUser1: Prisma.userUncheckedCreateInput = {
    id: 1,
    username: "TEST",
    password: "test",
    role: role.student,
}

let savedUser2: Prisma.userUncheckedCreateInput = {
    id: 2,
    username: "TEST2",
    password: "test",
    role: role.professor,
}

let savedUser3: Prisma.userUncheckedCreateInput = {
    id: 3,
    username: "TEST3",
    password: "test",
    role: role.professor,
}

describe("Users", () => {
    describe("Get users", () => {
        describe("Exist users", () => {
            beforeEach(async () => {
                await prisma.user.createMany({ data: [savedUser1, savedUser2, savedUser3] })
            })
    
            afterEach(async () => {
                await prisma.user.deleteMany({ where: { password: "test" } })
            })
    
            it("should retrieve all users", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                await getUsers(null, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, [
                    {
                        id: 1,
                        username: "TEST",
                        role: role.student
                    },
                    {
                        id: 2,
                        username: "TEST2",
                        role: role.professor
                    },
                    {
                        id: 3,
                        username: "TEST3",
                        role: role.professor
                    }
                ]);
            })
        })
        describe("Not exist users", () => {
            it("should retrieve an empty array", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                await getUsers(null, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json, []);
            })
        })


    })

    describe("Get user by id", () => {
        describe("there are at least one user", () => {
            beforeEach(async () => {
                await prisma.user.create({ data: savedUser1 })
            })

            afterEach(async () => {
                await prisma.user.deleteMany({ where: { password: "test" } })
            })

            it("should retrive the user with the id given", async () => {
                const res = {
                    json: sinon.default.spy(),
                    status: sinon.default.stub().returnsThis(),
                };
                const req = {
                    params: {
                        id: 1
                    }
                }
                await getUser(req, res)
                sinon.default.assert.calledWith(res.status, 200);
                sinon.default.assert.calledWith(res.json,
                    {
                        id: 1,
                        username: "TEST",
                        role: role.student
                    });
            })
        })
        describe("There are no users", () => {
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
                await getUser(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith(null)
            })
        })
    })

    describe("Create user", () => {
        describe("With valid input data", () => {
            afterEach(async () => {
                await prisma.user.deleteMany({ where: { username: {startsWith: "TEST" }} })
            })
            it("User created successfully", async () => {
                const req = {
                    body: {
                        username: "test",
                        password: "test",
                        role: role.student,
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createUser(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario creado correctamente" });
                const userCreated = await prisma.user.findFirst({ where: { username: "TEST" } })
                expect(userCreated).not.toBeNull()
            });

            describe('Password must be encrypted', () => {
                it("password shouldn't be test", async () => {
                    const req = {
                        body: {
                            username: "test",
                            password: "tes",
                            role: role.student
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createUser(req, res);
                    const user = await prisma.user.findFirst({
                        where: {
                            username: "TEST"
                        }
                    });
                    expect(user!!.password).not.toBe("testpassword");
                });
            })

            it("should assign role to the user correctly", async () => {
                const req = {
                    body: {
                        username: "test",
                        password: "test",
                        role: role.professor
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createUser(req, res);
                const user = await prisma.user.findFirst({
                    where: {
                        username: "TEST"
                    }
                });
                expect(user!!.role).toBe(role.professor);
            });


        })

        describe("The user already exists", () => {

            beforeEach(async () => {
                await prisma.user.create({ data: savedUser1 })
            })

            afterEach(async () => {
                await prisma.user.deleteMany({ where: { password: "test" } })
            })

            it("should return a 400", async () => {
                const req = {
                    body: {
                        id: 1,
                        username: "test",
                        password: "test",
                        role: role.student,
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await createUser(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "El usuario ya existe" });
            });
        })

        describe("Try to create a user with wrong fields", () => {
            describe('With emtpy field', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            password: "test",
                            role: role.student
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el usuario" });
                });
            })
            describe('With wrong data types', () => {
                it("should return 500", async () => {
                    const req = {
                        body: {
                            username: 435,
                            role: "admin"
                        }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await createUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al crear el usuario" });
                })
            })
        })
    })

    describe("Login", () => {
        const user = {
            id: 1,
            username: "TESTUSER",
            password: "",
            role: role.student
        };

        beforeAll(async () => {
            user.password = await bcrypt.hash("testpassword", 10)
            await prisma.user.create({ data: user })
        })
        afterAll(async () => {
            await prisma.user.deleteMany({ where: { username: "TESTUSER" } })
        })
        describe("Success", () => {
            it("when valid credentials", async () => {
                const req = {
                    body: {
                        username: "testuser",
                        password: "testpassword"
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await login(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    id: user.id,
                    username: user.username,
                    role: "student",
                    roleType: user.role,
                    token: expect.any(String)
                });
            })
        })

        describe("Failure", () => {
            it("when invalid credentials", async () => {
                const req = {
                    body: {
                        username: "testuser",
                        password: "wrongpassword"
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await login(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario o contraseña incorrectos" });
            })

            it("when user does not exists", async () => {
                const req = {
                    body: {
                        username: "nonexistentuser",
                        password: "testpassword"
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await login(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario o contraseña incorrectos" });
            })

            it("when invalid input", async () => {
                const req = {
                    body: {
                        username: "",
                        password: ""
                    }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await login(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario o contraseña incorrectos" });
            })
        })

    })

    describe("Update user", () => {
        describe("User exists", () => {
            const user = {
                id: 1,
                username: "TESTUSER",
                password: "",
                role: role.student
            };

            beforeEach(async () => {
                user.password = await bcrypt.hashSync("testpassword", 10)
                await prisma.user.create({ data: user })
            })
            afterEach(async () => {
                await prisma.user.deleteMany({ where: { id: 1 } })
            })
            it("should update username, password and role", async () => {
                const req = {
                    body: {
                        id: 1,
                        username: "newUsername",
                        password: "newPassword",
                        role: role.admin
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateUser(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario modificado correctamente" });
                const userModified = await prisma.user.findFirst({ where: { id: 1 } })
                expect(userModified?.username).toBe("NEWUSERNAME")
                expect(userModified?.password).not.toBe("")
                expect(userModified?.role).toBe(req.body.role)
            })

            it("should update with existing values with empty values", async () => {
                const req = {
                    body: {
                        id: 1,
                        username: "",
                        password: "",
                        role: ""
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateUser(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario modificado correctamente" });
                const userModified = await prisma.user.findFirst({ where: { id: 1 } })
                expect(userModified?.username).toBe(user.username)
                expect(userModified?.password).toBe(user.password)
                expect(userModified?.role).toBe(user.role)
            })

        })

        describe("User not exists", () => {
            it("should return 404", async () => {
                const req = {
                    body: {
                        id: 999,
                        username: "newUsername",
                        password: "",
                        role: "admin"
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await updateUser(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
            });
        })
    })

    describe("Delete user", () => {
        describe("Exists user", () => {
            const user = {
                id: 1,
                username: "testuser",
                password: "",
                role: role.student
            };

            beforeAll(async () => {
                user.password = await bcrypt.hashSync("testpassword", 10)
                await prisma.user.create({ data: user })
            })

            it("should delete with valid id", async () => {
                const req = { params: { id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteUser(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario eliminado correctamente" });
                const result = await prisma.user.findFirst({ where: { id: 1 } })
                expect(result).toBeNull()
            })
        })

        describe("Failure", () => {
            describe("User not exists", () => {
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
                    await deleteUser(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
                });
            })

            describe("When providing an invalid id", () => {
                describe("Should return 400", () => {
                    it("with no id", async () => {
                        const mockReq = { params: {} };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteUser(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                    });

                    it("with invalid id", async () => {
                        const mockReq = { params: { id: "invalid" } };
                        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                        await deleteUser(mockReq, mockRes);
                        expect(mockRes.status).toHaveBeenCalledWith(400);
                        expect(mockRes.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de usuario válido" });
                    });
                })

            })

        })

    })

    describe("Import users", () => {
        describe("Valid csv file", () => {
            afterEach(async () => {
                await prisma.user.deleteMany({ where: { username: { startsWith: "testuser" } } })
            })
            it("File is uploaded and users are successfully created", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/user_test.csv')
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
                await importUsers(req, res)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.json).toHaveBeenCalledWith({ message: "Usuarios creados correctamente" })
                const usersCreated = await prisma.user.findMany({ where: { username: { startsWith: "testuser" } } })
                expect(usersCreated.length).toBe(3)
                expect(usersCreated[0].username).toBe("testuser1")
                expect(usersCreated[0].role).toBe(role.student)
                expect(usersCreated[1].username).toBe("testuser2")
                expect(usersCreated[1].role).toBe(role.student)
                expect(usersCreated[2].username).toBe("testuser3")
                expect(usersCreated[2].role).toBe(role.professor)
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
                    url: '/api/user/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importUsers(req, res)
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
                    url: '/api/user/file',
                    headers: formData.getHeaders()
                })

                formData.pipe(req)
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
                await importUsers(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al importar los usuarios" })
            })

            it("should return 500 if file has missing fields", async () => {
                const formData = new FormData();
                formData.append('file',
                    fs.createReadStream('../files/user_missing_fields.csv')
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
                await importUsers(req, res)
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.json).toHaveBeenCalledWith({ message: "No puede haber campos vacíos" })
            })
        })
    })

    describe("Get all course's users", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const userCourse1: Prisma.UserCourseUncheckedCreateInput = {
            course_id: course.id!,
            user_id: savedUser1.id!
        }
        const userCourse2: Prisma.UserCourseUncheckedCreateInput = {
            course_id: course.id!,
            user_id: savedUser2.id!
        }
        describe("Valid course id", () => {
            describe("Course has no users", () => {
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
                    await getUsersByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([]);
                })
            })
            describe("Course has users", () => {
                beforeEach(async () => {
                    await prisma.user.createMany({ data: [savedUser1, savedUser2] })
                    await prisma.course.create({ data: course })
                    await prisma.userCourse.createMany({ data: [userCourse1, userCourse2] })
                })
                afterEach(async () => {
                    await prisma.user.deleteMany({ where: { password: "test" } })
                    await prisma.course.deleteMany({ where: { id: 1 } })
                    await prisma.userCourse.deleteMany({ where: { course_id: 1 } })
                })
                it("should retrieve all course's users giving course id", async () => {
                    const req = {
                        params: { id: 1 }
                    };
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };
                    await getUsersByCourse(req, res)
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith([
                        {
                            id: savedUser1.id,
                            username: savedUser1.username,
                            role: savedUser1.role
                        },
                        {
                            id: savedUser2.id,
                            username: savedUser2.username,
                            role: savedUser2.role
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
                await getUsersByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" })
            })

            it("should return 400 when course id is not provided", async () => {
                const req = { params: {} };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };
                await getUsersByCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: "Debe proporcionar un ID de curso válido" });
            })
        })

    })

    describe("Change user password", () => {
        describe("User exists", () => {
            const user: Prisma.userUncheckedCreateInput = {
                id: 1,
                username: "test",
                password: "",
                role: role.student
            }
            beforeAll(async () => {
                user.password = await bcrypt.hash("test", 10)
                await prisma.user.create({ data: user })
            })
            afterAll(async () => {
                await prisma.user.deleteMany({ where: { username: { startsWith: "test" } } })
            })
            describe("The password is successfully changed", () => {
                it("should update the password if the users exists and the actual password matches", async () => {
                    const req = {
                        params: {
                            id: 1
                        },
                        body: {
                            actualPassword: "test",
                            newPassword: "newPassword"
                        }
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }

                    await changePassword(req, res)

                    expect(res.status).toHaveBeenCalledWith(200)
                    expect(res.json).toHaveBeenCalledWith({ message: "La contraseña se ha actualizado correctamente" })
                    const user = await prisma.user.findFirst({ where: { id: 1 } })
                    const match = await bcrypt.compare(req.body.newPassword, user?.password);
                    expect(match).toBeTruthy()
                })
            })
            describe("Password does not match", () => {
                it("should return 400", async () => {
                    const req = {
                        params: {
                            id: 1
                        },
                        body: {
                            actualPassword: "test_not_match",
                            newPassword: "newPassword"
                        }
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }

                    await changePassword(req, res)

                    expect(res.status).toHaveBeenCalledWith(400)
                    expect(res.json).toHaveBeenCalledWith({ message: "Credencial inválida" })
                })
            })
            describe("Invalid parameters", () => {
                it("should returns an error when parameters are missing", async () => {
                    const req = {
                        params: {},
                        body: {}
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }

                    await changePassword(req, res)

                    expect(res.status).toHaveBeenCalledWith(500)
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al modificar la contraseña" })
                })

                it("should return an error if body is missing or incomplete", async () => {
                    const req = {
                        params: {
                            id: 1
                        },
                        body: {}
                    }
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    }

                    await changePassword(req, res)

                    expect(res.status).toHaveBeenCalledWith(500)
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al modificar la contraseña" })
                })
            })
        })

        describe("User does not exists", () => {
            it("should return 404", async () => {
                const req = {
                    params: {
                        id: 1
                    },
                    body: {
                        actualPassword: "test_not_match",
                        newPassword: "newPassword"
                    }
                }
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }

                await changePassword(req, res)

                expect(res.status).toHaveBeenCalledWith(404)
                expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" })
            })
        })
    })

    describe("Delete user from course", () => {
        const course: Prisma.courseUncheckedCreateInput = {
            id: 1,
            name: "courseTest",
            description: "courseDescriptionTest",
        }
        const userCourse1: Prisma.UserCourseUncheckedCreateInput = {
            course_id: course.id!,
            user_id: savedUser1.id!
        }
        describe("With valid parameters", () => {
            beforeAll(async () => {
                await prisma.user.create({ data: savedUser1 })
                await prisma.course.create({ data: course })
            })
            afterAll(async () => {
                await prisma.user.deleteMany({ where: { id: 1 } })
                await prisma.course.deleteMany({ where: { id: 1 } })
            })
            describe("User belongs to course", () => {
                beforeEach(async () => {
                    await prisma.userCourse.create({ data: userCourse1 })
                })
                afterEach(async () => {
                    await prisma.userCourse.deleteMany({ where: { user_id: 1 } })
                })
                it("should delete the user form course", async () => {
                    const req = { params: { course_id: "1", user_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteUserFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.json).toHaveBeenCalledWith({ message: "Usuario eliminado del curso correctamente" });
                });
            })
            describe("User does not belong to course", () => {
                it("should return an error", async () => {
                    const req = { params: { course_id: "1", user_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteUserFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el usuario del curso" });
                })
            })
        })
        describe("With invalid parameters", () => {
            it("should return 500 if user id is not a number", async () => {
                const req = { params: { course_id: "1", user_id: "not_a_number" } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteUserFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el usuario del curso" });
            })
            it("should return 404 if user does not exists", async () => {
                const req = { params: { course_id: 1, user_id: 1 } };
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                await deleteUserFromCourse(req, res);
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: "El usuario especificado no existe" });
            });
            describe("User exists", () => {
                beforeAll(async () => {
                    await prisma.user.create({data: savedUser1})
                })
                afterAll(async () => {
                    await prisma.user.delete({where: {id: savedUser1.id}})
                })
                it("should return 500 if course id is not a number", async () => {
                    const req = { params: { course_id: "not_a_number", user_id: "1" } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteUserFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith({ message: "Ha ocurrido un error al eliminar el usuario del curso" });
                });
                it("should return 404 if course does not exists", async () => {
                    const req = { params:{ course_id: 1, user_id: 1 } };
                    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
                    await deleteUserFromCourse(req, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: "El curso especificado no existe" });
                });
            })
            
        })
    })
})