import { TestBed } from '@angular/core/testing';

import { ApiProfessorService } from './api.professor.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Question } from '@app/core/models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { User, UserResult } from '@app/core/models/user.model';
import { Game, GameState, GameType, PointsType } from '@app/core/models/game.model';

describe('ApiProfessorService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let service: ApiProfessorService;

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
  let game1: Game = {
    host_id: 1,
    survey_id: 1,
    type: GameType.online,
    state: GameState.created,
    are_questions_visible: true,
    point_type: PointsType.double,
    course_id: 1
  }
  let game2: Game = {
    host_id: 1,
    survey_id: 1,
    type: GameType.online,
    state: GameState.created,
    are_questions_visible: true,
    point_type: PointsType.double,
    course_id: 1
  }
  let result1: UserResult = {
    game_id: 1,
    user_id: 1,
    answer_results: [],
    score: 1000,
  }
  let result2: UserResult = {
    game_id: 2,
    user_id: 1,
    answer_results: [],
    score: 1030,
  }

  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete', 'post']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpyObj },
      ]
    }).compileComponents()
    service = TestBed.inject(ApiProfessorService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createQuestion()', () => {
    it("should return success message", () => {
      let message = { message: "Pregunta creada correctamente"}
      httpClientSpy.post.and.returnValue(of(message))
      service.createQuestion(question1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.post.and.returnValue(throwError(() => error))
      service.createQuestion(question1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('getQuestions()', () => {
    it("should return all questions", () => {
      httpClientSpy.get.and.returnValue(of([question1, question2]))
      service.getQuestions().subscribe({
        next: (questions) => {
          expect(questions).toEqual([question1, question2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getQuestions().subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getQuestionsByUser()', () => {
    it("should return user's questions", () => {
      httpClientSpy.get.and.returnValue(of([question1, question2]))
      service.getQuestionsByUser(1).subscribe({
        next: (questions) => {
          expect(questions).toEqual([question1, question2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getQuestionsByUser(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getQuestionById()', () => {
    it("should return user's courses", () => {
      httpClientSpy.get.and.returnValue(of(question1))
      service.getQuestionById(1).subscribe({
        next: (question) => {
          expect(question).toEqual(question1)
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getQuestionById(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('createSurvey()', () => {
    it("should return success message", () => {
      let message = { message: "Pregunta creada correctamente"}
      httpClientSpy.post.and.returnValue(of(message))
      service.createSurvey(survey1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.post.and.returnValue(throwError(() => error))
      service.createSurvey(survey1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('getSurveysByUser()', () => {
    it("should return user's surveys", () => {
      httpClientSpy.get.and.returnValue(of([survey1, survey2]))
      service.getSurveysByUser(1).subscribe({
        next: (surveys) => {
          expect(surveys).toEqual([survey1, survey2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getSurveysByUser(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getSurveyById()', () => {
    it("should return survey giving its id", () => {
      httpClientSpy.get.and.returnValue(of(survey1))
      service.getSurveyById(1).subscribe({
        next: (survey) => {
          expect(survey).toEqual(survey1)
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getSurveyById(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getUsersByCourse()', () => {
    it("should return course's users", () => {
      httpClientSpy.get.and.returnValue(of([user1, user2]))
      service.getUsersByCourse(1).subscribe({
        next: (users) => {
          expect(users).toEqual([user1, user2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getUsersByCourse(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getSurveysByCourse()', () => {
    it("should return course's surveys", () => {
      httpClientSpy.get.and.returnValue(of([survey1, survey1]))
      service.getSurveysByCourse(1).subscribe({
        next: (surveys) => {
          expect(surveys).toEqual([survey1, survey1])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getSurveysByCourse(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getQuestionsByCourse()', () => {
    it("should return course's questions", () => {
      httpClientSpy.get.and.returnValue(of([question1, question2]))
      service.getQuestionsByCourse(1).subscribe({
        next: (questions) => {
          expect(questions).toEqual([question1, question2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getQuestionsByCourse(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('createGame()', () => {
    it("should return game created", () => {
      httpClientSpy.post.and.returnValue(of(game1))
      service.createGame(game1).subscribe({
        next: (game) => {
          expect(game).toEqual(game1)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.post.and.returnValue(throwError(() => error))
      service.createGame(game1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateGame()', () => {
    it("should return game updated", () => {
      httpClientSpy.put.and.returnValue(of(game1))
      service.updateGame(game1).subscribe({
        next: (game) => {
          expect(game).toEqual(game1)
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.put.and.returnValue(throwError(() => error))
      service.updateGame(game1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGameById()', () => {
    it("should game giving id", () => {
      httpClientSpy.get.and.returnValue(of(game1))
      service.getGameById(1).subscribe({
        next: (game) => {
          expect(game).toEqual(game1)
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGameById(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('createUserResults()', () => {
    it("should return success message", () => {
      let message = {message: "Resultados creados correctamente"}
      httpClientSpy.post.and.returnValue(of(message))
      service.createUserResults([result1, result2]).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.post.and.returnValue(throwError(() => error))
      service.createUserResults([result1, result2]).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('importQuestions()', () => {
    it("should return success message", () => {
      let message = {message: "Preguntas creadas correctamente"}
      httpClientSpy.post.and.returnValue(of(message))
      service.importQuestions(new FormData(), 1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.post.and.returnValue(throwError(() => error))
      service.importQuestions(new FormData(), 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateQuestion()', () => {
    it("should return success message", () => {
      let message = {message: "Pregunta actualizada correctamente"}
      httpClientSpy.put.and.returnValue(of(message))
      service.updateQuestion(question1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.put.and.returnValue(throwError(() => error))
      service.updateQuestion(question1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteQuestion()', () => {
    it("should return success message", () => {
      let message = {message: "Pregunta eliminada correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteQuestion(1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteQuestion(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateSurvey()', () => {
    it("should return success message", () => {
      let message = {message: "Pregunta eliminada correctamente"}
      httpClientSpy.put.and.returnValue(of(message))
      service.updateSurvey(survey1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.put.and.returnValue(throwError(() => error))
      service.updateSurvey(survey1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteSurvey()', () => {
    it("should return success message", () => {
      let message = {message: "Cuestionario eliminado correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteSurvey(1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteSurvey(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteSurveyFromCourse()', () => {
    it("should return success message", () => {
      let message = {message: "Cuestionario eliminado del curso correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteSurveyFromCourse(1, 1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteSurveyFromCourse(1, 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteQuestionFromCourse()', () => {
    it("should return success message", () => {
      let message = {message: "Pregunta eliminada del curso correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteQuestionFromCourse(1, 1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteQuestionFromCourse(1, 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteUserFromCourse()', () => {
    it("should return success message", () => {
      let message = {message: "Usuario eliminado del curso correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteUserFromCourse(1, 1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteUserFromCourse(1, 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteGame()', () => {
    it("should return success message", () => {
      let message = {message: "Juego eliminado correctamente"}
      httpClientSpy.delete.and.returnValue(of(message))
      service.deleteGame(1).subscribe({
        next: (msg) => {
          expect(msg).toEqual(message)
        }
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.delete.and.returnValue(throwError(() => error))
      service.deleteGame(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGameResultsByGame()', () => {
    it("should return game results", () => {
      httpClientSpy.get.and.returnValue(of([result1, result2]))
      service.getGameResultsByGame(1).subscribe({
        next: (results) => {
          expect(results).toEqual([result1, result2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGameResultsByGame(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGamesByCourse()', () => {
    it("should return course's games", () => {
      httpClientSpy.get.and.returnValue(of([game1, game2]))
      service.getGamesByCourse(1).subscribe({
        next: (games) => {
          expect(games).toEqual([game1, game2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGamesByCourse(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

});
