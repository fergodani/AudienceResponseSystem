import { User } from '@app/core/models/user.model';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

export class AuthServiceStub {
    user = of({
        id: 1,
        username: "admin",
        role: 'admin'
    })

    private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public userObservable: Observable<User | null> = this.userSubject.asObservable();

    login(user: User) {
        let newUser: User
        if (user.username == "testUserAdmin") {
            newUser = new User("testUserAdmin", "testPassword", "admin")
            return of(newUser).pipe(
                map(user => {
                  this.userSubject.next(user);
                  return user;
                })
              )
        }
        if (user.username == "testUserProfessor") {
            newUser = new User("testUserProfessor", "testPassword", "professor")
            return of(newUser).pipe(
                map(user => {
                  this.userSubject.next(user);
                  return user;
                })
              )
        }
        else {
            newUser = new User("testUserStudent", "testPassword", "student")
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