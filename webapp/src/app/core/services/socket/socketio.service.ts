import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { Course } from '../../models/course.model';
import { Game, GameState } from '../../models/game.model';
import { User, UserResult } from '../../models/user.model';
import { ApiAuthService } from '../auth/api.auth.service';
import { ApiProfessorService } from '../professor/api.professor.service';
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
    if(this.socket == undefined || !this.socket.connected){
      this.socket = io(environment.socketUrl, socketOptions);
    }
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
      this.gameSubject.next(game);
    })
  }

  waitForSurveys() {
    if(!this.isListening('wait_for_surveys')){
      this.socket.on('wait_for_surveys', (data: Game) => {
        this.newGameSubject.next(data)
      })
    }
  }

  joinSocketCourses(courses: Course[]) {
    let coursesIds = courses.map(course => course.id + '')
    this.socket.emit('join_socket_course', coursesIds)
  }

  // Verificar si existe una función de escucha para un evento específico
  private isListening(event: string): boolean {
    const listeners = this.socket.listeners(event);
    return listeners.length > 0;
  }
}
