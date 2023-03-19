import { Component, Input, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Answer } from '@app/core/models/answer.model';
import { Game, GameState } from '@app/core/models/game.model';
import { Question, QuestionResult } from '@app/core/models/question.model';
import { User } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
export class HostGameComponent implements OnInit {

  constructor(
    private socketService: SocketioService,
  ) {
  }
  game: Game = <Game>{};
  gameStateType = GameState;
  questionList: Question[] = [];
  questionIndex: number = 0;
  actualQuestion: Question = <Question>{};
  correctAnswers: Answer[] = [];
  usersConnected: User[] = [];
  players: User[] = [];

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
      if (game.survey != undefined) {
        this.game = game;
        console.log(this.game.survey?.questions)
        this.questionList = this.game.survey?.questions!;
        this.actualQuestion = this.questionList[this.questionIndex];
        this.correctAnswers = this.actualQuestion.answers.filter( a => a.is_correct);
      }
    })
    this.socketService.setupHostSocketConnection();
    this.socketService.socket.on('get-answer-from-player', (data: QuestionResult) => {
      this.players.push(data.user);
    })
  }

  startGame() {
    this.socketService.startGame()
    this.socketService.socket.emit('question_preview', () => {
      this.startPreviewCountdown(5, this.questionIndex);
    })
  }

  timeLeft: number = 5;

  startPreviewCountdown(seconds: number, index: number) {
    this.isLeaderboardScreen = false;
    this.isPreviewScreen = true;
    let time = seconds;
    let interval = setInterval(() => {
      this.timeLeft = time;
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
    console.log("Start question countdonw: " + time)
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
    this.isQuestionResult = false;
    this.isLeaderboardScreen = true;
    setTimeout(() => {
      this.socketService.socket.emit("question_preview", () => {
        this.startPreviewCountdown(5, index);
        this.players = [];
      })
    }, 5000)
  }

  displayQuestion(index: number) {
    if (index === this.questionList.length) {
      // TODO: mostrar la tabla final y acabar el juego
      this.isQuestionResult = false;
      this.isLeaderboardScreen = true;
    } else {
      this.actualQuestion = this.questionList[index];
      this.correctAnswers = this.actualQuestion.answers.filter( a => a.is_correct);
      this.questionIndex++;
      let time = this.actualQuestion.answer_time;
      this.timeLeft = time;
      this.socketService.socket.emit('start_question_time', time, this.actualQuestion, () => {
        this.startQuestionCountdown(time, ++index);
      })
    }
  }
}
