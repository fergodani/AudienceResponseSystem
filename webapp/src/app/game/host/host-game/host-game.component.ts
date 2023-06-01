import { Component, Input, OnInit, Type, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnswerResult } from '@app/core/models/answer.model';
import { Answer } from '@app/core/models/answer.model';
import { Game, GameSession, GameSessionState, GameState } from '@app/core/models/game.model';
import { Question, QuestionSurvey } from '@app/core/models/question.model';
import { User, UserResult } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { SocketioService } from '@app/core/socket/socketio.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
export class HostGameComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.apiProfessorService
    .deleteGame(this.gameSession.game.id!)
    .subscribe()
  }


  constructor(
    private socketService: SocketioService,
    private authService: ApiAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiProfessorService: ApiProfessorService,
    private dialog: MatDialog
  ) {
  }


  game: Game = <Game>{};
  gameStateType = GameState;
  actualQuestion: Question = <Question>{};
  correctAnswers: Answer[] = [];
  isLoading: boolean = false;
  gameSession: GameSession = <GameSession>{}
  gameSessionState = GameSessionState

  isError = false
  errorMessage = ''

  questionType = Type;

  @Input() courseId: number = 0;

  ngOnInit() {
    const course_id = this.activatedRoute.snapshot.paramMap.get('course_id');
    const game_id = this.activatedRoute.snapshot.paramMap.get('game_id');
    this.socketService.setupSocketConnection();
    this.apiProfessorService
      .getGameById(Number(game_id))
      .subscribe((game: Game) => {
        this.socketService.socket.emit('create_game', game, course_id + '', (gameSession: GameSession) => {
          console.log(gameSession.user_results)
          this.gameSession = gameSession
        });
      })
    this.socketService.socket.on('connectUser', (gameSession: GameSession) => {
      this.gameSession = gameSession
    });
    this.socketService.socket.on('get-answer-from-player', (data: UserResult) => {
      const index = this.gameSession.user_results.findIndex(u => u.user_id === data.user_id)
      if (index >= 0)
        this.gameSession.user_results[index] = data
      else
        this.gameSession.user_results[0] = data
      console.log(this.gameSession)
    })
  }

  startGame() {
    this.gameSession.game.state = GameState.started;
    this.apiProfessorService
      .updateGame(this.gameSession.game)
      .subscribe()
    this.actualQuestion = this.gameSession.question_list[this.gameSession.question_index]
    this.gameSession.state = GameSessionState.is_preview_screen
    this.socketService.socket.emit('question_preview', this.gameSession, () => {
      this.isLoading = true;
      this.timeLeft = 5;
      this.startPreviewCountdown(5);
    })
  }

  timeLeft: number = 5;

  startPreviewCountdown(seconds: number) {
    let time = seconds;
    let interval = setInterval(() => {
      this.timeLeft = time;
      this.isLoading = false;
      if (time > 0) {
        time--;
      } else {
        clearInterval(interval);
        this.displayQuestion();
      }
    }, 1000)
  }

  startQuestionCountdown(seconds: number) {
    let time = seconds;
    let interval = setInterval(() => {
      this.timeLeft = time;
      if (time > 0) {
        time--;
      } else {
        clearInterval(interval);
        this.displayQuestionResult();
      }
    }, 1000)
  }

  displayQuestionResult() {
    this.gameSession.state = GameSessionState.is_question_result
    this.socketService.socket.emit("finish_question", this.gameSession, () => {
      setTimeout(() => {
        this.gameSession.state = GameSessionState.is_leaderboard_screen
        this.socketService.socket.emit("show_score", this.gameSession, () => {
          this.displayCurrentLeaderboard();
        })
      }, 5000)
    })
  }

  displayCurrentLeaderboard() {
    this.gameSession.users.sort((a, b) => {
      const scoreA = this.gameSession.user_results.find(u => u.user_id === a.id)?.score
      const scoreB = this.gameSession.user_results.find(u => u.user_id === b.id)?.score
      return scoreB! - scoreA!
    })
  }

  displayQuestion() {
      this.actualQuestion = this.gameSession.question_list[this.gameSession.question_index]
      this.timeLeft = this.actualQuestion.answer_time;
      this.correctAnswers = this.actualQuestion.answers.filter((a: Answer) => a.is_correct)
      this.gameSession.state = GameSessionState.is_question_screen
      this.socketService.socket.emit('start_question_time', this.gameSession, () => {
        this.gameSession.question_index++
        this.startQuestionCountdown(this.timeLeft);
      })
  }

  nextQuestion() {
    if (this.gameSession.question_index == this.gameSession.question_list.length) {
      this.gameSession.state = GameSessionState.is_finished
      this.socketService.socket.emit('finish_game', this.gameSession);
    } else {
      this.gameSession.state = GameSessionState.is_preview_screen
      this.socketService.socket.emit("question_preview", this.gameSession, () => {
        this.timeLeft = 5;
        this.startPreviewCountdown(5);
      })
    }
  }

  leaveGame() {
    this.socketService.closeGame(this.gameSession.user_results, this.gameSession.game);
    this.router.navigate(['/professor/home'])
  }
}
