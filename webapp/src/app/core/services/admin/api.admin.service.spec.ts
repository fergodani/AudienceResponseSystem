import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Question } from '@app/core/models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { User } from '@app/core/models/user.model';
import { ApiService } from './api.admin.service';
import { Course, QuestionCourse, SurveyCourse, UserCourse } from '@app/core/models/course.model';

describe('ApiAdminService', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>
    let service: ApiService;

    let course1: Course = {
        id: 1,
        name: "testCourse1",
        description: "testDescription"
    }
    let course2: Course = {
        id: 2,
        name: "testCourse2",
        description: "testDescription"
    }

    let question1: Question = {
        id: 1,
        description: "question1",
        answers: [],
        answer_time: 5,
        subject: 'subject',
        type: 'multioption',
        resource: '',
        user_creator_id: 1
    }
    let question2: Question = {
        id: 2,
        description: "question2",
        answers: [],
        answer_time: 5,
        subject: 'subject',
        type: 'multioption',
        resource: '',
        user_creator_id: 1
    }
    let survey1: Survey = {
        title: "surveyTest1",
        user_creator_id: 1,
        questions: [],
        questionsSurvey: [],
        resource: ""
    }
    let survey2: Survey = {
        title: "surveyTest2",
        user_creator_id: 1,
        questions: [],
        questionsSurvey: [],
        resource: ""
    }
    let user1: User = {
        id: 1,
        username: "testUser1",
        role: "student"
    }
    let user2: User = {
        id: 1,
        username: "testUser1",
        role: "student"
    }
    let userCourse: UserCourse = {
        course_id: 1,
        users: [user1, user2]
    }
    let surveyCourse: SurveyCourse = {
        course_id: 1,
        surveys: [survey1, survey2]
    }
    let questionCourse: QuestionCourse = {
        course_id: 1,
        questions: [question1, question2]
    }

    beforeEach(() => {
        let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete', 'post']);
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClientSpyObj },
            ]
        }).compileComponents()
        service = TestBed.inject(ApiService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createUser()', () => {
        it("should return success message", () => {
            let message = { message: "Usuario creada correctamente" }
            httpClientSpy.post.and.returnValue(of(message))
            service.createUser(user1).subscribe({
                next: (msg) => {
                    expect(msg).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.createUser(user1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('createCourse()', () => {
        it("should return success message", () => {
            let message = { message: "Curso creada correctamente" }
            httpClientSpy.post.and.returnValue(of(message))
            service.createCourse(course1).subscribe({
                next: (msg) => {
                    expect(msg).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.createCourse(course1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('getUsers()', () => {
        it("should return all users", () => {
            httpClientSpy.get.and.returnValue(of([user1, user2]))
            service.getUsers().subscribe({
                next: (users) => {
                    expect(users).toEqual([user1, user2])
                }
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.get.and.returnValue(throwError(() => error))
            service.getUsers().subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
    })

    describe('getUser()', () => {
        it("should return user giving id", () => {
            httpClientSpy.get.and.returnValue(of(user1))
            service.getUser(1).subscribe({
                next: (user) => {
                    expect(user).toEqual(user1)
                }
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.get.and.returnValue(throwError(() => error))
            service.getUser(1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
    })

    describe('getCourses()', () => {
        it("should return all courses", () => {
            httpClientSpy.get.and.returnValue(of([course1, course2]))
            service.getCourses().subscribe({
                next: (courses) => {
                    expect(courses).toEqual([course1, course2])
                }
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.get.and.returnValue(throwError(() => error))
            service.getCourses().subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
    })

    describe('getCourse()', () => {
        it("should return course giving id", () => {
            httpClientSpy.get.and.returnValue(of(course1))
            service.getCourse(1).subscribe({
                next: (c) => {
                    expect(c).toEqual(course1)
                }
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.get.and.returnValue(throwError(() => error))
            service.getCourse(1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
        })
    })

    describe('deleteUser()', () => {
        it("should return success message", () => {
            let message = { message: "Usuario eliminado correctamente" }
            httpClientSpy.delete.and.returnValue(of(message))
            service.deleteUser(1).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.delete.and.returnValue(throwError(() => error))
            service.deleteUser(1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
        })
    })

    describe('deleteCourse()', () => {
        it("should return success message", () => {
            let message = { message: "Curso eliminado correctamente" }
            httpClientSpy.delete.and.returnValue(of(message))
            service.deleteCourse(1).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.delete.and.returnValue(throwError(() => error))
            service.deleteUser(1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateUser()', () => {
        it("should return success message", () => {
            let message = { message: "Usuario actualizado correctamente" }
            httpClientSpy.put.and.returnValue(of(message))
            service.updateUser(user1).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.put.and.returnValue(throwError(() => error))
            service.updateUser(user1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateCourse()', () => {
        it("should return success message", () => {
            let message = { message: "Curso actualizado correctamente" }
            httpClientSpy.put.and.returnValue(of(message))
            service.updateCourse(course1).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.put.and.returnValue(throwError(() => error))
            service.updateCourse(course1).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
        })
    })

    describe('uploadUserFile()', () => {
        it("should return success message", () => {
            let message = {message: "Usuarios creados correctamente"}
            httpClientSpy.post.and.returnValue(of(message))
            service.uploadUserFile(new FormData()).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.uploadUserFile(new FormData()).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('uploadCourseFile()', () => {
        it("should return success message", () => {
            let message = {message: "Cursos creados correctamente"}
            httpClientSpy.post.and.returnValue(of(message))
            service.uploadCourseFile(new FormData()).subscribe({
                next: (m) => {
                    expect(m).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.uploadUserFile(new FormData()).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('addUserToCourse()', () => {
        it("should return success message", () => {
            let message = {message: "Usuarios añadidos correctamente"}
            httpClientSpy.post.and.returnValue(of(message))
            service.addUserToCourse(userCourse).subscribe({
                next: (msg) => {
                    expect(msg).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.addUserToCourse(userCourse).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('addSurveyToCourse()', () => {
        it("should return success message", () => {
            let message = {message: "Cuestionarios añadidos correctamente"}
            httpClientSpy.post.and.returnValue(of(message))
            service.addSurveyToCourse(surveyCourse).subscribe({
                next: (msg) => {
                    expect(msg).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.addSurveyToCourse(surveyCourse).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('addQuestionToCourse()', () => {
        it("should return success message", () => {
            let message = {message: "Preguntas añadidas correctamente"}
            httpClientSpy.post.and.returnValue(of(message))
            service.addQuestionToCourse(questionCourse).subscribe({
                next: (msg) => {
                    expect(msg).toEqual(message)
                }
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
        it('should return an error message if something wrong ocurred', () => {
            let error = new Error('Something bad happened; please try again later.')
            httpClientSpy.post.and.returnValue(throwError(() => error))
            service.addQuestionToCourse(questionCourse).subscribe({
                error: (errorReturned) => {
                    expect(errorReturned).toEqual(error)
                },
            })
            expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
        })
    })
});
