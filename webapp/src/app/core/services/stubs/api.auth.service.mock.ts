import { User } from '@app/core/models/user.model';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

export class AuthServiceStub {
  user = of({
    id: 1,
    username: "admin",
    role: 'admin'
  })

  user2: User = {
    id: 1,
    username: "admin",
    role: 'admin'
  }

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.user2);
  public userObservable: Observable<User | null> = this.userSubject.asObservable();

  login(user: User) {
    if (user.username == "testUserAdmin") {
      let newUser: User = {
        id: 1,
        username: "testUserAdmin",
        password: "testPassword",
        role: "admin"
      }
      return of(newUser).pipe(
        map(user => {
          this.userSubject.next(user);
          return user;
        })
      )
    }
    if (user.username == "testUserProfessor") {
      let newUser: User = {
        id: 1,
        username: "testUserProfessor",
        password: "testPassword",
        role: "professor"
      }
      return of(newUser).pipe(
        map(user => {
          this.userSubject.next(user);
          return user;
        })
      )
    }
    else {
      let newUser: User = {
        id: 1,
        username: "testUserStudent",
        password: "testPassword",
        role: "student"
      }
      return of(newUser).pipe(
        map(user => {
          this.userSubject.next(user);
          return user;
        })
      )
    }
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

}