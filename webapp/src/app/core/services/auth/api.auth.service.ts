import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  headers = new HttpHeaders()

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
    this.headers
    .set('Access-Control-Allow-Headers', 'Origin');
  }

  login(user: User) {
    return this.http.post<User>(`${environment.apiUrl}/user/login`, user, {headers: this.headers})
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
