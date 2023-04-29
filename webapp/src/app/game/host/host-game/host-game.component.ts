import { Component, Input, OnInit, Type, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Answer } from '@app/core/models/answer.model';
import { Game, GameSession, GameSessionState, GameState } from '@app/core/models/game.model';
import { Question, QuestionSurvey } from '@app/core/models/question.model';
import { User, UserResult } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { SocketioService } from '@app/core/socket/socketio.service';


@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
@HostListener('window:beforeunload')
export class HostGameComponent implements OnInit{

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    event.preventDefault();
    event.returnValue = 'Estás seguro de que desea salir?'
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
    // Esto sucede cuando el usuario le da a que sí
    // En el caso del profesor, si se sale de la página, el juego se acaba
    // Por lo que habría que envíar un emit a todos los jugadores para echarlos del juego
    // Finalmente, habría que eliminar el juego, para que no quede constancia, puesto que no es válido
    this.socketService.socket.emit('game_over', (response: any) => {
    });
    window.location.reload()
  }

  @HostListener('window:onpopstate', ['$event'])
  onpopstateHandler(event: any) {
    
  }

  constructor(
    private socketService: SocketioService,
    private authService: ApiAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiProfessorService: ApiProfessorService
  ) {
  }
  game: Game = <Game>{};
  gameStateType = GameState;
  questionList: Question[] = [];
  questionIndex: number = 0;  
  actualQuestion: Question = <Question>{};
  correctAnswers: Answer[] = [];
  usersConnected: User[] = [];
  userResults: UserResult[] = [];
  isFinished: boolean = false;
  isLoading: boolean = false;

  isLeaderboardScreen: boolean = false;
  isPreviewScreen: boolean = false;
  isQuestionScreen: boolean = false;
  isQuestionResult: boolean = false;

  gameSession: GameSession = <GameSession>{}
  gameSessionState = GameSessionState

  isError = false
  errorMessage = ''

  addUsers(users: User[]) {
    this.usersConnected = users;
  }

  questionType = Type;


  @Input() courseId: number = 0;

  ngOnInit() {
    const course_id = this.activatedRoute.snapshot.paramMap.get('course_id');
    const game_id = this.activatedRoute.snapshot.paramMap.get('game_id');
    this.socketService.game.subscribe((game: Game) => {
      if (game.survey != undefined && this.questionList.length == 0) {
        this.game = game;
        this.game.survey?.questionsSurvey.forEach((qS: QuestionSurvey) => {
          qS.question.position = qS.position
        })
        this.game.survey?.questionsSurvey.forEach((qS: QuestionSurvey) => {
          this.questionList.push(qS.question)
        })
        this.questionList.sort((q1, q2) => {return q1.position! - q2.position!})
        this.actualQuestion = this.questionList[this.questionIndex];
        this.correctAnswers = this.actualQuestion.answers.filter(a => a.is_correct);
      }
    })
    this.socketService.setupSocketConnection();
    //this.socketService.createGame(Number(game_id), Number(course_id))
    this.apiProfessorService
      .getGameById(Number(game_id))
      .subscribe((game: Game) => {
        this.socketService.socket.emit('create_game', game, course_id + '', (response: string) => {
          this.isError = true;
          this.errorMessage = response;
        });
      })
    this.socketService.socket.on('connectUser', (gameSession: GameSession) => {
      this.gameSession = gameSession
    });
    this.socketService.socket.on('get-answer-from-player', (data: string) => {
      this.userResults.push(JSON.parse(data));
      console.log(this.userResults)
    })
  }

  startGame() {
    this.socketService.startGame()
    this.socketService.socket.emit('question_preview', () => {
      this.isLoading = true;
      this.timeLeft = 5;
      this.startPreviewCountdown(5, this.questionIndex);
    })
  }

  timeLeft: number = 5;

  startPreviewCountdown(seconds: number, index: number) {

    let time = seconds;
    let interval = setInterval(() => {
      this.timeLeft = time;
      this.isLeaderboardScreen = false;
      this.isPreviewScreen = true;
      this.isLoading = false;
      if (time > 0) {
        time--;
      } else {
        clearInterval(interval);
        this.displayQuestion(index);
      }
    }, 1000)
  }

  startQuestionCountdown(seconds: number, index: number) {
    this.isPreviewScreen = false;
    this.isQuestionScreen = true;
    let time = seconds;
    let interval = setInterval(() => {
      this.timeLeft = time;
      if (time > 0) {
        time--;
      } else {
        clearInterval(interval);
        this.displayQuestionResult(index);
      }
    }, 1000)
  }

  displayQuestionResult(index: number) {
    this.isQuestionScreen = false;
    this.isQuestionResult = true;
    setTimeout(() => {
      this.displayCurrentLeaderboard(index);
    }, 5000)
  }

  displayCurrentLeaderboard(index: number) {
    this.userResults.sort((a, b) => {
      return b.score - a.score;
    })
    this.isQuestionResult = false;
    this.isLeaderboardScreen = true;
    setTimeout(() => {
      if (this.questionIndex == this.questionList.length) {
        this.socketService.socket.emit('finish_game');
        this.isFinished = true;
      } else {
        this.isLeaderboardScreen = false;
        this.socketService.socket.emit("question_preview", () => {
          this.timeLeft = 5;
          this.startPreviewCountdown(5, index);
          this.userResults = [];
        })
      }

    }, 5000)
  }

  displayQuestion(index: number) {
    if (index === this.questionList.length) {
      // TODO: mostrar la tabla final, guardar todos los resultados finales
      // y acabar el juego
      this.isQuestionResult = false;
      this.isLeaderboardScreen = true;
      this.socketService.socket.emit('finish_game');
    } else {
      this.actualQuestion = this.questionList[index];
      this.correctAnswers = this.actualQuestion.answers.filter(a => a.is_correct);
      this.questionIndex++;
      let time = this.actualQuestion.answer_time;
      this.timeLeft = time;
      this.socketService.socket.emit('start_question_time', time, this.actualQuestion, () => {
        this.startQuestionCountdown(time, ++index);
      })
    }
  }

  leaveGame() {
    this.socketService.closeGame(this.userResults);
    this.router.navigate(['/professor/home'])
  }
}
