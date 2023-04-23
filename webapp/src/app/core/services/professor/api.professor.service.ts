import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Question } from '../../models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { User, UserResult } from '@app/core/models/user.model';
import { Game } from '@app/core/models/game.model';
import { Message } from '@app/core/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiProfessorService {

   apiUrl = "http://localhost:5000/api"

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/question`, question)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/question`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestionsByUser(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/question/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/question/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(`${this.apiUrl}/survey`, survey)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveysByUser(id: number): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/survey/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveyById(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.apiUrl}/survey/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getUsersByCourse(id: number): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/user/courses/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSurveysByCourse(id: number): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/survey/courses/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/game`, game)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/game`, game)
    .pipe(
      catchError(this.handleError)
    )
  }

  createUserResults(userResults: UserResult[]): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/game/results`, userResults)
    .pipe(
      catchError(this.handleError)
    )
  }

  importQuestions(formData: FormData, id: number): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/question/file/${id}`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }

  exportQuestions(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/question/export/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateQuestion(question: Question): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/question`, question)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteQuestion(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/question/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateSurvey(survey: Survey): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/survey`, survey)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteSurvey(id: number): Observable<Message> {
    console.log(id)
    return this.http.delete<Message>(`${this.apiUrl}/survey/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
