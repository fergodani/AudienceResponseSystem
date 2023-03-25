import { Component, Input, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from '@app/core/models/answer.model';
import { Game, GameState } from '@app/core/models/game.model';
import { Question, QuestionSurvey } from '@app/core/models/question.model';
import { User, UserResult } from '@app/core/models/user.model';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
export class HostGameComponent implements OnInit {

  constructor(
    private socketService: SocketioService,
    private router: Router
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

  addUsers(users: User[]) {
    this.usersConnected = users;
  }

  questionType = Type;


  @Input() courseId: number = 0;

  ngOnInit() {
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
    this.socketService.setupHostSocketConnection();
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
