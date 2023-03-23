import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Token, User, UserResult } from '../../models/user.model';
import { Router } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { Game } from '@app/core/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class ApiStudentService {

  constructor(
    private http: HttpClient
  ) {
  }

  apiUrl = "http://localhost:5000/api"

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

  getCoursesByUser(id: number): Observable<Course[]>{
    return this.http.get<Course[]>(`${this.apiUrl}/course/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  getOpenGamesByCourses(courses: Course[]): Observable<Game[]>{
    const coursesIds = courses.map(c => c.id)
    console.log(coursesIds)
    return this.http.get<Game[]>(`${this.apiUrl}/game/course/`, {params: {course: coursesIds}})
    .pipe(
      catchError(this.handleError)
    )
  }

  changePassword(userId: number, actualPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/user/password/${userId}`, { actualPassword, newPassword })
    .pipe(
      catchError(this.handleError)
    )
  }

  getGamesResultsByUser(userId: number): Observable<UserResult[]> {
    return this.http.get<UserResult[]>(`${this.apiUrl}/game/results/${userId}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
