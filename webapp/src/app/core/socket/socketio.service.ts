import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { io } from 'socket.io-client';
import { Course } from '../models/course.model';
import { Game, GameState } from '../models/game.model';
import { equals, User, UserResult } from '../models/user.model';
import { ApiAuthService } from '../services/auth/api.auth.service';
import { ApiProfessorService } from '../services/professor/api.professor.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(
    private authService: ApiAuthService,
    private apiProfessorService: ApiProfessorService
  ) {
   }

  socket:any;

  // Usuarios conectados al juego -- Host
  private usersConnectedSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users: Observable<User[]> = this.usersConnectedSubject.asObservable();
  private userList: User[] = [];

  // Juego nuevo para jugar -- Estudiante
  private newGameSubject: Subject<Game> = new Subject<Game>();
  public newGame: Observable<Game> = this.newGameSubject.asObservable();

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
    const game = this.gameValue;
    game.state = GameState.started;
    this.apiProfessorService
    .updateGame(game)
    .subscribe()
    this.gameSubject.next(game);
    this.socket.emit('start_game', this.gameValue);
    
  }

  closeGame(userResults: UserResult[]) {
    const game = this.gameValue;
    game.state = GameState.closed;
    this.apiProfessorService
    .updateGame(game)
    .subscribe()
    this.apiProfessorService
    .createUserResults(userResults)
    .subscribe()
  }

  sendUser(id: string){
    this.socket.emit('join_game', this.authService.userValue, id)
    this.socket.on('move_to_survey', (game: Game) => {
      console.log(game)
      this.gameSubject.next(game);
    })
  }

  waitForSurveys(){
    this.socket.on('wait_for_surveys', (data: Game) => {
      console.log(data)
      this.newGameSubject.next(data)
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
