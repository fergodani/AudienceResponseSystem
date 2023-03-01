import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://localhost:3000/api"

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

  createUser(user: User): Observable<User> {
    return this.http.post<User>("http://localhost:3000/api/user/create", user)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>("http://localhost:3000/api/course", course)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("http://localhost:3000/api/user")
      .pipe(
        catchError(this.handleError)
      );
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("http://localhost:3000/api/course")
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/user/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteCourse(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/course/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
