import { TestBed } from '@angular/core/testing';

import { ApiStudentService } from './api.user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Course } from '@app/core/models/course.model';
import { of, throwError } from 'rxjs';
import { Game, GameState, GameType, PointsType } from '@app/core/models/game.model';
import { UserResult } from '@app/core/models/user.model';

describe('ApiUserService', () => {

  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let service: ApiStudentService;

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
  let result1: UserResult = {
    user_id: 1,
    game_id: 1,
    score: 1000,
    correct_questions: 2,
    wrong_questions: 2,
    total_questions: 4,
    answer_results: []
  }
  let result2: UserResult = {
    user_id: 1,
    game_id: 1,
    score: 2000,
    correct_questions: 1,
    wrong_questions: 3,
    total_questions: 4,
    answer_results: []
  }

  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpyObj },
      ]
    }).compileComponents()
    service = TestBed.inject(ApiStudentService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCoursesByUser()', () => {
    it("should return user's courses", () => {
      httpClientSpy.get.and.returnValue(of([course1, course2]))
      service.getCoursesByUser(1).subscribe({
        next: (courses) => {
          expect(courses).toEqual([course1, course2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getCoursesByUser(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getOpenOrStartedGamesByCourses()', () => {
    let game1: Game = {
      host_id: 1,
      state: GameState.started,
      survey_id: 1,
      type: GameType.online,
      are_questions_visible: true,
      point_type: PointsType.standard,
      course_id: 1
    }
    let game2: Game = {
      host_id: 1,
      state: GameState.created,
      survey_id: 1,
      type: GameType.online,
      are_questions_visible: true,
      point_type: PointsType.standard,
      course_id: 2
    }

    it("should return open or started games giving course", () => {
      httpClientSpy.get.and.returnValue(of([game1, game2]))
      service.getOpenOrStartedGamesByCourses([course1, course2]).subscribe({
        next: (games) => {
          expect(games).toEqual([game1, game2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getOpenOrStartedGamesByCourses([course1, course2]).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('changePassword()', () => {
    it('should return a success message', () => {
      httpClientSpy.put.and.returnValue(of("La contraseña se ha actualizado"))
      service.changePassword(1, "actualPass", "newPass").subscribe({
        next: (msg) => {
          expect(msg).toEqual("La contraseña se ha actualizado")
        }
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.put.and.returnValue(throwError(() => error))
      service.changePassword(1, "actualPass", "newPass").subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGamesResultsByUser()', () => {
    
    it('should return the game results giving user', () => {
      httpClientSpy.get.and.returnValue(of([result1, result2]))
      service.getGamesResultsByUser(1).subscribe({
        next: (results) => {
          expect(results).toEqual([result1, result2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGamesResultsByUser(1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGamesResultsByUserAndCourse()', () => {
    it('should return the game results giving user and course', () => {
      httpClientSpy.get.and.returnValue(of([result1, result2]))
      service.getGamesResultsByUserAndCourse(1, 1).subscribe({
        next: (results) => {
          expect(results).toEqual([result1, result2])
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGamesResultsByUserAndCourse(1, 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getGamesResultByUserAndGame()', () => {
    it('should return the game result giving user and game', () => {
      httpClientSpy.get.and.returnValue(of(result1))
      service.getGamesResultByUserAndGame(1, 1).subscribe({
        next: (result) => {
          expect(result).toEqual(result1)
        }
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
    it('should return an error message if something wrong ocurred', () => {
      let error =  new Error('Something bad happened; please try again later.')
      httpClientSpy.get.and.returnValue(throwError(() => error))
      service.getGamesResultByUserAndGame(1, 1).subscribe({
        error: (errorReturned) => {
          expect(errorReturned).toEqual(error)
        },
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1)
    })
  })
});
