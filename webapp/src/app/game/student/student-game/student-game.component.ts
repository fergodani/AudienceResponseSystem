import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game, GameState } from '@app/core/models/game.model';
import { Question, QuestionResult } from '@app/core/models/question.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-student-game',
  templateUrl: './student-game.component.html',
  styleUrls: ['./student-game.component.css']
})
export class StudentGameComponent implements OnInit {


  constructor(
    private authService: ApiAuthService,
    private socketService: SocketioService,
    private route: ActivatedRoute
  ) {

    this.socketService.game.subscribe((game: Game) => {
      console.log(game)
      if (game.survey != undefined) {
        this.game = game;
        console.log(this.game.survey?.questions)
        this.questionList = this.game.survey?.questions!;
        this.actualQuestion = this.questionList[this.questionIndex];
      }
    })

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.socketService.setupSocketConnection();
    this.socketService.sendUser(id!);
    this.socketService.socket.on("host-start-preview", () => {
      this.isStart = true;
      this.isPreviewScreen = true;
      this.isResultScreen = false;
      this.startTimerPreview(5);
    })
    this.socketService.socket.on("host-start-question-timer", (time: number, question: Question) => {
      this.timeLeft = time;
      this.actualQuestion = question;
      
      this.startQuestionTimer(time);
    })
  }

  game: Game = <Game>{};
  questionList: Question[] = [];
  questionIndex: number = 0;
  actualQuestion: Question = <Question>{};
  gameStateType = GameState;
  isStart: boolean = false;
  result: QuestionResult = <QuestionResult>{};

  questionType = Type;

  timeLeft: number = 5;

  startTimerPreview(seconds: number) {
    let time = seconds;
    let interval = setInterval(() => {
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
    let answerSeconds = 0;
    let interval = setInterval(() => {
      this.timeLeft = time;
      if (time > 0) {
        time--;
        this.answerTime = answerSeconds;
      } else {
        clearInterval(interval);
        
        this.isQuestionScreen = false;
        this.isPreviewScreen = false;
        this.isQuestionAnswered = false;
        this.isResultScreen = true;
      }
      answerSeconds++;
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

  sendAnswer() {
    this.result = {
      user: this.authService.userValue!,
      questionIndex: this.questionIndex,
      user_points: this.score
    }
    this.socketService.socket.emit('send_answer', this.result);
  }

  displayAnswerResult() {
    this.isQuestionScreen = false;
    this.isQuestionAnswered = true;
    setTimeout(() => {
      this.isQuestionAnswered = false;
      this.isResultScreen = true;
    }, 5000)
  }

  checkAnswer(id: number) {
    let answer = this.actualQuestion.answers.find( a => a.id === id)
    if (answer?.is_correct){
      this.result.user_points = 10;
    }else {
      this.result.user_points = 0;
    }
    this.isQuestionAnswered = true;
    this.displayAnswerResult();
  }

  

}
