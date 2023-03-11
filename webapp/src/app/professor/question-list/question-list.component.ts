import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { Question } from 'src/app/core/models/question.model';
import { ApiProfessorService } from 'src/app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  constructor(
    private apiProfessorService: ApiProfessorService,
    private authService: ApiAuthService
  ) { }

  ngOnInit(): void {
    this.apiProfessorService
      .getQuestionsByUser(this.authService.userValue!.id)
      .subscribe(questions => { this.questions = questions; this.isLoading = false; console.log(questions) })
  }

  isLoading: boolean = true;
  @Input() isCreatingSurvey: boolean = false;
  questions: Question[] = [];
  @Output() questionToAdd = new EventEmitter<Question>;

  addQuestionToSurvey(question: Question) {
    this.questionToAdd.emit(question);
  }

}
