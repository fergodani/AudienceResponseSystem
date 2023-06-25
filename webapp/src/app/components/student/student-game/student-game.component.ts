import { Component, OnInit, Type, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, AnswerResult } from '@app/core/models/answer.model';
import { GameSession, GameSessionState, PointsType } from '@app/core/models/game.model';
import { Question } from '@app/core/models/question.model';
import { UserResult } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { SocketioService } from '@app/core/socket/socketio.service';

const STANDARD_POINTS = 1000;

@Component({
  selector: 'app-student-game',
  templateUrl: './student-game.component.html',
  styleUrls: ['./student-game.component.css'],
})
export class StudentGameComponent implements OnInit {

  constructor(
    private authService: ApiAuthService,
    private socketService: SocketioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  actualQuestion: Question = <Question>{};
  result: UserResult = {
    user_id: this.authService.userValue!.id,
    game_id: 0,
    answer_results: [],
    score: 0
  };
  lastScore: number = 0;
  haveAnswered: boolean = false;
  isResultScreen = false
  shortQuestionForm = new FormGroup({
    shortQuestion: new FormControl(),
  })

  questionType = Type;

  timeLeft: number = 5;
  interval: any

  gameSession: GameSession = <GameSession>{}
  gameSessionState = GameSessionState

  isError = false
  errorMessage = ''

  answerTime: number = 0;
  correctAnswerCount: number = 0;
  score: number = 0;
  isLoading = false;

  actualAnswer?: Answer

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.socketService.setupSocketConnection();
    this.socketService.socket.emit('join_game', this.authService.userValue, id, (gameSession: GameSession) => {
      if (gameSession) {
        this.gameSession = gameSession
        this.result.game_id = gameSession.game.id!
        if (this.gameSession.state == this.gameSessionState.is_question_screen) {
          this.haveAnswered = true
          const result = this.gameSession.user_results.find(u => u.user_id == this.authService.userValue!.id)
          if (result != undefined)
            this.result = result
        }

      } else {
        this.isError = true
        this.errorMessage = "Ha ocurrido un error"
      }
    })

    this.socketService.socket.on("host-start-preview", (gameSession: GameSession) => {
      this.gameSession = gameSession
      this.timeLeft = 5;
      this.isLoading = true;
      this.haveAnswered = false
      this.actualAnswer = undefined
      this.startTimerPreview(5);
    })
    this.socketService.socket.on("host-start-question-timer", (gameSession: GameSession) => {
      this.gameSession = gameSession
      this.actualQuestion = this.gameSession.question_list[this.gameSession.question_index];
      this.startQuestionTimer()
    })
    this.socketService.socket.on("finish_question", (gameSession: GameSession) => {
      this.gameSession = gameSession
      // TODO Si el usuario no ha envíado una respuesta, enviarla aquí una respuesta vacía
      clearInterval(this.interval)
      this.answerTime = 0
      this.lastScore = this.result.score;
      if (!this.haveAnswered) {
        let answerResult: AnswerResult = {
          user_id: this.authService.userValue!.id,
          game_id: this.gameSession.game.id!,
          question_id: this.actualQuestion.id,
          question_index: this.gameSession.question_index,
          answered: false
        }
        this.result.answer_results.push(answerResult)
        this.socketService.socket.emit('send_answer', this.result);

      }
    })
    this.socketService.socket.on('show_score', (gameSession: GameSession) => {
      this.gameSession = gameSession
    })
    this.socketService.socket.on("finish_game", (gameSession: GameSession) => {
      console.log(gameSession)
      this.gameSession = gameSession
      this.socketService.socket.emit('leave_game');
    })
  }

  startTimerPreview(seconds: number) {
    let time = seconds;
    let interval = setInterval(() => {
      this.isLoading = false;
      this.timeLeft = time;
      if (time > 0) {
        console.log(time)
        time--;
      } else {
        clearInterval(interval);
      }
    }, 1000)
  }

  startQuestionTimer() {
    this.answerTime = 0;
    this.interval = setInterval(() => {
      this.answerTime++;
    }, 1000)
  }

  checkAnswer(id: number) {
    this.haveAnswered = true;
    this.actualAnswer = this.actualQuestion.answers.find(a => a.id === id)
    this.calculatePoints(this.actualAnswer!.is_correct)

    let answerResult: AnswerResult = {
      user_id: this.authService.userValue!.id,
      game_id: this.gameSession.game.id!,
      question_id: this.actualQuestion.id,
      question_index: this.gameSession.question_index,
      answer_id: this.actualAnswer!.id,
      answered: true
    }
    this.result.answer_results.push(answerResult)
    this.socketService.socket.emit('send_answer', this.gameSession.game.id, this.result);
  }

  checkShortAnswer() {
    this.haveAnswered = true;
    const answer = this.shortQuestionForm.value.shortQuestion ?? "";
    let isCorrect = false;
    this.actualQuestion.answers.forEach((a) => {
      if (answer === a.description) {
        isCorrect = true;
        this.actualAnswer = a
      }
    })
    if (this.actualAnswer == undefined)
      this.actualAnswer = new Answer("", false)
    this.calculatePoints(isCorrect);

    let answerResult: AnswerResult = {
      user_id: this.authService.userValue!.id,
      game_id: this.gameSession.game.id!,
      question_id: this.actualQuestion.id,
      question_index: this.gameSession.question_index,
      short_answer: answer,
      answered: true
    }
    this.result.answer_results.push(answerResult)
    this.socketService.socket.emit('send_answer', this.gameSession.game.id, this.result);
  }

  calculatePoints(isCorrect: boolean) {
    // https://support.kahoot.com/hc/es/articles/115002303908-C%C3%B3mo-funcionan-los-puntos
    // 1. Divide el tiempo de respuesta por el temporizador de pregunta
    // 2. Divide ese valor entre 2
    // 3. Resta ese valor a 1
    // 4. Multiplica los puntos posibles por ese valor
    // 5. Redondea al número entero más cercano
    if (isCorrect) {
      let points = (1 - ((this.answerTime / this.actualQuestion.answer_time) / 2)) * STANDARD_POINTS;
      if (this.gameSession.game.point_type == PointsType.double)
        points = points * 2;
      this.result.score += Math.round(points);
    }

  }

  async leaveGame() {
    await this.router.navigate(['/student/home'])
  }



}
