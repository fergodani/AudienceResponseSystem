import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/core/models/question.model';
import { ApiProfessorService } from 'src/app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit{

  constructor(private apiProfessorService: ApiProfessorService) {}

  ngOnInit(): void {

    this.apiProfessorService
      .getQuestions()
      .subscribe(questions => {this.questions = questions; this.isLoading = false; console.log(questions)})
  }

  questions: Question[] = [];
  isLoading: boolean = true;

}
