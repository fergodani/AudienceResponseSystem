import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserResult } from '../../models/user.model';
import { Course } from '@app/core/models/course.model';
import { Game } from '@app/core/models/game.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiStudentService {

  constructor(
    private http: HttpClient
  ) {
  }

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

  getCoursesByUser(id: number): Observable<Course[]>{
    return this.http.get<Course[]>(`${environment.apiUrl}/course/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getOpenOrStartedGamesByCourses(courses: Course[]): Observable<Game[]>{
    const coursesIds = courses.map(c => c.id)
    return this.http.get<Game[]>(`${environment.apiUrl}/game/course/`, {params: {course: coursesIds}})
    .pipe(
      catchError(this.handleError)
    )
  }

  changePassword(userId: number, actualPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${environment.apiUrl}/user/password/${userId}`, { actualPassword, newPassword })
    .pipe(
      catchError(this.handleError)
    )
  }

  getGamesResultsByUser(userId: number): Observable<UserResult[]> {
    return this.http.get<UserResult[]>(`${environment.apiUrl}/game/user/results/${userId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getGamesResultsByUserAndCourse(userId: number, courseId: number): Observable<UserResult[]> {
    return this.http.get<UserResult[]>(`${environment.apiUrl}/game/results/user/${userId}/course/${courseId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getGamesResultByUserAndGame(userId: number, gameId: number): Observable<UserResult> {
    return this.http.get<UserResult>(`${environment.apiUrl}/game/results/user/${userId}/game/${gameId}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
