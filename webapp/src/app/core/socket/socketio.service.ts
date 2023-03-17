import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { io } from 'socket.io-client';
import { Course } from '../models/course.model';
import { Game } from '../models/game.model';
import { equals, User } from '../models/user.model';
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

  // Usuarios conectados al juego -- Host
  private usersConnectedSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users: Observable<User[]> = this.usersConnectedSubject.asObservable();
  private userList: User[] = [];

  // Juegos disponibles para jugar -- Estudiante
  private gamesAvailableSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public gamesAvailable: Observable<Game[]> = this.gamesAvailableSubject.asObservable();
  private gamesList: Game[] = [];

  private gameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>(<Game>{});
  public game: Observable<Game> = this.gameSubject.asObservable();

  private course_id: number = 0;



  public get userValue(): User[]{
    return this.usersConnectedSubject.value;
  }

  public get gameValue(): Game {
    return this.gameSubject.value;
  }

  setupSocketConnection() {
    this.socket = io('http://localhost:5000');
  }

  setupHostSocketConnection() {
    this.socket = io('http://localhost:5000');
    
    this.socket.on('connectUser', (data: User) => {
      let alreadyConnected = false;
      this.userList.forEach(u => {
        if(equals(u, data)){
          alreadyConnected = true;
        }
      })
      if(!alreadyConnected){
        this.userList.push(data)
        this.usersConnectedSubject.next(this.userList)
      }
      
    });
  }

  createGame(game: Game, courseId: number) {
    this.course_id = courseId;
    this.gameSubject.next(game);
    this.socket.emit('create_game', game, courseId + '');
  }

  startGame() {
    this.socket.emit('start_game', this.gameValue);
    this.socket.on('move_to_survey', (game: Game) => {
      console.log(game)
      this.gameSubject.next(game);
    })
  }

  sendUser(id: string){
    this.socket.emit('join_game', this.authService.userValue, id)
  }

  waitForSurveys(){
    this.socket.on('wait_for_surveys', (data: any) => {
      console.log(data)
      this.gamesList.push(data)
      this.gamesAvailableSubject.next(this.gamesList)
    })
  }

  joinSocketCourses(courses: Course[]) {
    let coursesIds = courses.map(course => course.id + '')
    this.socket.emit('join_socket_course', coursesIds)
    this.socket.on('move_to_survey', (game: Game) => {
      console.log("moving to survey")
      this.gameSubject.next(game);
    })
  }
}
