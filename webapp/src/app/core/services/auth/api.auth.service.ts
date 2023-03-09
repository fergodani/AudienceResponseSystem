import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Token, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  apiUrl = "http://localhost:3000/api"

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

  constructor(private http: HttpClient) { }

  userLogged: User = new User('', '');

  login(user: User): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/user/login`, user)
    .pipe(
      catchError(this.handleError)
    )
  }

  setUser(user: User) {
    this.userLogged = user;
  }
}
