import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { io } from 'socket.io-client';
import { Course } from '../models/course.model';
import { Game, GameState } from '../models/game.model';
import { equals, User, UserResult } from '../models/user.model';
import { ApiAuthService } from '../services/auth/api.auth.service';
import { ApiProfessorService } from '../services/professor/api.professor.service';
import { SocketOptions } from 'socket.io-client';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(
    private authService: ApiAuthService,
    private apiProfessorService: ApiProfessorService
  ) {
  }

  socket: any;

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



  public get userValue(): User[] {
    return this.usersConnectedSubject.value;
  }

  public get gameValue(): Game {
    return this.gameSubject.value;
  }

  setupSocketConnection() {
    const socketOptions: SocketOptions = {
      auth: {
        token: this.authService.userValue?.token
      }
    }
    this.socket = io(environment.socketUrl, socketOptions);
  }

  createGame(game_id: number, courseId: number) {
    this.course_id = courseId;
    this.apiProfessorService
      .getGameById(game_id)
      .subscribe((game: Game) => {
        this.socket.emit('create_game', game, courseId + '');
      })
    
  }


  closeGame(userResults: UserResult[], game: Game) {
    game.state = GameState.closed;
    this.apiProfessorService
      .updateGame(game)
      .subscribe()
    this.apiProfessorService
      .createUserResults(userResults)
      .subscribe()
  }

  sendUser(id: string) {
    this.socket.emit('join_game', this.authService.userValue, id)
    this.socket.on('move_to_survey', (game: Game) => {
      console.log(game)
      this.gameSubject.next(game);
    })
  }

  waitForSurveys() {
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
