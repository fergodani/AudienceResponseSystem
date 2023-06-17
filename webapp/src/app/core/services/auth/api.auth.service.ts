import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Token, User } from '../../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  apiUrl = "http://localhost:5000/api"

  login(user: User) {
    return this.http.post<User>(`${this.apiUrl}/user/login`, user)
    .pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    )
  }

  public get userValue(): User | null{
    return this.userSubject.value;
  }

  async logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    await this.router.navigate(['/login']);
  }

}
