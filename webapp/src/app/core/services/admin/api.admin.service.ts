import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Course, SurveyCourse, UserCourse } from '../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://192.168.1.41:5000/api"
  users: User[] = []

  // TODO: pasar la url a un .env
  // TODO: usar httpOptions para establecer header

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
    return this.http.post<User>("http://192.168.1.41:5000/api/user/create", user)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>("http://192.168.1.41:5000/api/course", course)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("http://192.168.1.41:5000/api/user")
      .pipe(
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("http://192.168.1.41:5000/api/course")
      .pipe(
        catchError(this.handleError)
      );
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/course/${id}`)
      .pipe(
        catchError(this.handleError)
      )
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

  updateUser(user: User): Observable<User> {
    console.log(user)
    return this.http.put<User>(`${this.apiUrl}/user`, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/course`, course)
      .pipe(
        catchError(this.handleError)
      )
  }

  uploadUserFile(formData: FormData): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/user/file`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  uploadCourseFile(formData: FormData): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/course/file`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }

  addUserToCourse(userCourse: UserCourse): Observable<unknown> {
    return this.http.post<UserCourse>(`${this.apiUrl}/course/addUser`, userCourse)
    .pipe(
      catchError(this.handleError)
    )
  }

  addSurveyToCourse(surveyCourse: SurveyCourse): Observable<unknown> {
    return this.http.post<SurveyCourse>(`${this.apiUrl}/course/addSurvey`, surveyCourse)
    .pipe(
      catchError(this.handleError)
    )
  }
}
