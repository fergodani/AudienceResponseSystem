import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Question } from '../../models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { User, UserResult } from '@app/core/models/user.model';
import { Game } from '@app/core/models/game.model';
import { Message } from '@app/core/models/message.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiProfessorService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  createQuestion(question: Question): Observable<Message> {
    return this.http.post<Message>(`${environment.apiUrl}/question`, question)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/question`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestionsByUser(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/question/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${environment.apiUrl}/question/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(`${environment.apiUrl}/survey`, survey)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveysByUser(id: number): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${environment.apiUrl}/survey/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveyById(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${environment.apiUrl}/survey/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getUsersByCourse(id: number): Observable<User[]>{
    return this.http.get<User[]>(`${environment.apiUrl}/user/courses/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveysByCourse(id: number): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${environment.apiUrl}/survey/courses/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestionsByCourse(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/question/courses/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }


  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${environment.apiUrl}/game`, game)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`${environment.apiUrl}/game`, game)
    .pipe(
      catchError(this.handleError)
    )
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${environment.apiUrl}/game/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  createUserResults(userResults: UserResult[]): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/game/results`, userResults)
    .pipe(
      catchError(this.handleError)
    )
  }

  importQuestions(formData: FormData, id: number): Observable<Message> {
    return this.http.post<Message>(`${environment.apiUrl}/question/file/${id}`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }

  exportQuestions(id: number): Observable<Message> {
    return this.http.get<Message>(`${environment.apiUrl}/question/export/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateQuestion(question: Question): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/question`, question)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteQuestion(id: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/question/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateSurvey(survey: Survey): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/survey`, survey)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteSurvey(id: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/survey/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteSurveyFromCourse(courseId: number, surveyId: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/survey/${surveyId}/course/${courseId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteQuestionFromCourse(courseId: number, questionId: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/question/${questionId}/course/${courseId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteUserFromCourse(courseId: number, userId: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/user/${userId}/course/${courseId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteGame(id: number): Observable<Message> {
    return this.http.delete<Message>(`${environment.apiUrl}/game/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getGameResultsByGame(gameId: number): Observable<UserResult[]> {
    return this.http.get<UserResult[]>(`${environment.apiUrl}/game/results/${gameId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getGamesByCourse(courseId: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${environment.apiUrl}/game/course/${courseId}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
