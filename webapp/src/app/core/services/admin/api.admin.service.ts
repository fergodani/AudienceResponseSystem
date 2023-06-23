import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Course, QuestionCourse, SurveyCourse, UserCourse } from '../../models/course.model';
import { Message } from '@app/core/models/message.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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

  createUser(user: User): Observable<Message> {
    console.log("createUser")
    return this.http.post<Message>(`${environment.apiUrl}/user/create`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCourse(course: Course): Observable<Course> {
    console.log("createCourse")
    return this.http.post<Course>(`${environment.apiUrl}/course`, course)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<User[]> {
    console.log("getUsers")
    return this.http.get<User[]>(`${environment.apiUrl}/user`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<User> {
    console.log("getUser")
    return this.http.get<User>(`${environment.apiUrl}/user/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  getCourses(): Observable<Course[]> {
    console.log("getCourses")
    return this.http.get<Course[]>(`${environment.apiUrl}/course`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCourse(id: number): Observable<Course> {
    console.log("getCourse")
    return this.http.get<Course>(`${environment.apiUrl}/course/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteUser(id: number): Observable<Message> {
    console.log("deleteUser")
    return this.http.delete<Message>(`${environment.apiUrl}/user/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteCourse(id: number): Observable<unknown> {
    console.log("deleteCourse")
    return this.http.delete(`${environment.apiUrl}/course/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  updateUser(user: User): Observable<Message> {
    console.log("updateUser")
    return this.http.put<Message>(`${environment.apiUrl}/user`, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  updateCourse(course: Course): Observable<Course> {
    console.log("updateCourse")
    return this.http.put<Course>(`${environment.apiUrl}/course`, course)
      .pipe(
        catchError(this.handleError)
      )
  }

  uploadUserFile(formData: FormData): Observable<Message> {
    console.log("uploadUserFile")
    return this.http.post<Message>(`${environment.apiUrl}/user/file`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  uploadCourseFile(formData: FormData): Observable<unknown> {
    console.log("uploadCourseFile")
    return this.http.post<unknown>(`${environment.apiUrl}/course/file`, formData)
      .pipe(
        catchError(this.handleError)
      )
  }

  addUserToCourse(userCourse: UserCourse): Observable<unknown> {
    console.log("addUserToCourse")
    return this.http.post<UserCourse>(`${environment.apiUrl}/course/addUser`, userCourse)
    .pipe(
      catchError(this.handleError)
    )
  }

  addSurveyToCourse(surveyCourse: SurveyCourse): Observable<unknown> {
    console.log("addSurveyToCourse")
    return this.http.post<SurveyCourse>(`${environment.apiUrl}/course/addSurvey`, surveyCourse)
    .pipe(
      catchError(this.handleError)
    )
  }

  addQuestionToCourse(questionCourse: QuestionCourse): Observable<Message> {
    console.log("addQuestionToCourse")
    return this.http.post<Message>(`${environment.apiUrl}/course/addQuestion`, questionCourse)
    .pipe(
      catchError(this.handleError)
    )
  }
}
