import { Component, OnInit, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, AnswerResult } from '@app/core/models/answer.model';
import { Game, GameState, PointsType } from '@app/core/models/game.model';
import { Question } from '@app/core/models/question.model';
import { UserResult } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { SocketioService } from '@app/core/socket/socketio.service';

const STANDARD_POINTS = 1000;

@Component({
  selector: 'app-student-game',
  templateUrl: './student-game.component.html',
  styleUrls: ['./student-game.component.css']
})
export class StudentGameComponent implements OnInit {


  constructor(
    private authService: ApiAuthService,
    private socketService: SocketioService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.socketService.game.subscribe((game: Game) => {
      if (game.survey != undefined) {
        this.game = game;
        this.result.game_id = game.id!;
      }
    })

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.socketService.setupSocketConnection();
    this.socketService.sendUser(id!);
    this.socketService.socket.on("host-start-preview", () => {
      this.timeLeft = 5;
      this.isStart = true;
      this.isLoading = true;
      this.startTimerPreview(5);
    })
    this.socketService.socket.on("host-start-question-timer", (time: number, question: Question) => {
      this.timeLeft = time;
      this.actualQuestion = question;
      this.startQuestionTimer(time);
    })
    this.socketService.socket.on("finish_game", () => {
      this.isFinished = true;
      this.socketService.socket.emit('leave_game');
    })
  }

  game: Game = <Game>{};
  questionList: Question[] = [];
  questionIndex: number = 0;
  actualQuestion: Question = <Question>{};
  gameStateType = GameState;
  isStart: boolean = false;
  isFinished: boolean = false;
  result: UserResult = {
    user: this.authService.userValue!,
    user_id: this.authService.userValue!.id,
    game_id: this.game.id!,
    answer_results: [],
    score: 0
  };
  lastScore: number = 0;
  haveAnswered: boolean = false;
  shortQuestionForm = new FormControl('');

  questionType = Type;

  timeLeft: number = 5;

  startTimerPreview(seconds: number) {
    let time = seconds;
    let interval = setInterval(() => {
      this.isPreviewScreen = true;
      this.isResultScreen = false;
      this.isLoading = false;
      this.timeLeft = time;
      if (time > 0) {
        console.log(time)
        time--;
      } else {
        clearInterval(interval);


        this.isPreviewScreen = false;
      }
    }, 1000)
  }

  startQuestionTimer(seconds: number) {
    let time = seconds;
    this.isQuestionScreen = true;
    this.isPreviewScreen = false;
    this.answerTime = 0;
    let interval = setInterval(() => {
      this.timeLeft = time;
      if (time > 0) {
        time--;
      } else {
        clearInterval(interval);

        this.isQuestionScreen = false;
        this.isPreviewScreen = false;
        this.isQuestionAnswered = false;
        this.isResultScreen = true;
        this.lastScore = this.result.score;
        if (!this.haveAnswered) {
          let answerResult: AnswerResult = {
            user_id: this.authService.userValue!.id,
            game_id: this.game.id!,
            question_id: this.actualQuestion.id,
            question_index: this.questionIndex,
            answered: false
          }
          this.result.answer_results.push(answerResult)
          this.socketService.socket.emit('send_answer', this.result);

        }
      }
      this.answerTime++;
    }, 1000)
  }

  // **************
  isQuestionAnswered: boolean = false;
  isPreviewScreen: boolean = false;
  isQuestionScreen: boolean = false;
  isResultScreen: boolean = false;
  answerTime: number = 0;
  correctAnswerCount: number = 0;
  score: number = 0;
  isLoading = false;

  displayAnswerResult() {
    this.isQuestionScreen = false;
    this.isQuestionAnswered = true;
    setTimeout(() => {
      this.isQuestionAnswered = false;
      this.isResultScreen = true;
    }, 5000)
  }

  checkAnswer(id: number) {
    this.haveAnswered = true;
    let answer = this.actualQuestion.answers.find(a => a.id === id)
    this.calculatePoints(answer!.is_correct)
    this.isQuestionAnswered = true;

    let answerResult: AnswerResult = {
      user_id: this.authService.userValue!.id,
      game_id: this.game.id!,
      question_id: this.actualQuestion.id,
      question_index: this.questionIndex,
      answer_id: answer!.id,
      answered: true
    }
    this.result.answer_results.push(answerResult)
    this.displayAnswerResult();
    this.socketService.socket.emit('send_answer', this.result);
  }

  checkShortAnswer() {
    this.haveAnswered = true;
    this.isQuestionAnswered = true;
    const answer = this.shortQuestionForm.value!;
    let isCorrect = false;
    console.log("Respues del usuario: " + answer)
    console.log("Respuestas correctas: ")
    this.actualQuestion.answers.forEach((a) => {
      console.log(a.description)
      if(answer === a.description){
        isCorrect = true;
      }
    })
    this.calculatePoints(isCorrect);

    let answerResult: AnswerResult = {
      user_id: this.authService.userValue!.id,
      game_id: this.game.id!,
      question_id: this.actualQuestion.id,
      question_index: this.questionIndex,
      short_answer: answer,
      answered: true
    }
    console.log(answerResult)
    this.result.answer_results.push(answerResult)
    this.displayAnswerResult();
    this.socketService.socket.emit('send_answer', this.result);
  }

  calculatePoints(isCorrect: boolean) {
    //TODO: mirar si hay más de una respuesta correcta
    //TODO: tener en cuenta el tipo de puntuación (estándar, doble, sin puntos)

    // https://support.kahoot.com/hc/es/articles/115002303908-C%C3%B3mo-funcionan-los-puntos
    // 1. Divide el tiempo de respuesta por el temporizador de pregunta
    // 2. Divide ese valor entre 2
    // 3. Resta ese valor a 1
    // 4. Multiplica los puntos posibles por ese valor
    // 5. Redondea al número entero más cercano
    if (isCorrect){
      let points = (1 - ((this.answerTime / this.actualQuestion.answer_time) / 2)) * STANDARD_POINTS;
      if (this.game.point_type == PointsType.double)
        points = points * 2;
      this.result.score += Math.round(points);
    }
      
  }

  leaveGame(){
    this.router.navigate(['/student/home'])
  }



}
