import { Component, Input } from '@angular/core';
import { Game } from '@app/core/models/game.model';
import { Question, Type } from '@app/core/models/question.model';

@Component({
  selector: 'app-host-survey-room',
  templateUrl: './host-survey-room.component.html',
  styleUrls: ['./host-survey-room.component.css']
})
export class HostSurveyRoomComponent {

  @Input() game: Game = <Game>{};
  questionList: Question[] = this.game.survey?.questions!;
  questionIndex: number = 0;
  actualQuestion: Question = this.questionList[this.questionIndex];

  questionType = Type;
}
