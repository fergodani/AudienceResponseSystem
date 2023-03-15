import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../models/user.model';
import { ApiAuthService } from '../services/auth/api.auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(
    private authService: ApiAuthService
  ) {
   }

  socket:any;

  private usersConnectedSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users: Observable<User[]> = this.usersConnectedSubject.asObservable();

  private userList: User[] = [];

  public get userValue(): User[]{
    return this.usersConnectedSubject.value;
  }

  setupSocketConnection() {
    this.socket = io('http://localhost:3333');

    this.socket.on('my broadcast', (data: any) => {
      
    });
  }

  setupHostSocketConnection() {
    this.socket = io('http://localhost:3333');

    this.socket.on('connectUser', (data: any) => {
      this.userList.push(data)
      console.log(this.userList);
      this.usersConnectedSubject.next(this.userList)
    });
  }

  sendUser(){
    this.socket.emit('my message', this.authService.userValue)
  }
}
