import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: ApiAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apiProfessorService
      .getQuestionsByUser(this.authService.userValue!.id)
      .subscribe(questions => { this.questions = questions; this.isLoading = false; console.log(questions) })
  }

  isLoading: boolean = true;
  @Input() isCreatingSurvey: boolean = false;
  @Input() isSelecting: boolean = false;
  questions: Question[] = [];
  @Output() questionToAdd = new EventEmitter<Question>;
  requiredFileType = "text/csv";
  fileName: string = ''

  addQuestionToSurvey(question: Question) {
    this.questionToAdd.emit(question);
  }

  createNewQuestion() {
    this.router.navigate(['/questions/create'])
  }

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];

    // TODO: comprobar de otra manera, si file es null daria error esto creo
    if (file && file.type == this.requiredFileType) {
      this.fileName = file.name;
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.apiProfessorService
    }
  }

  exportQuestions() {
    this.apiProfessorService
    .exportQuestions(this.authService.userValue!.id)
    .subscribe(data =>this.downloadFile(data))
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'text/csv'})
    const url = window.URL.createObjectURL(blob)
    window.open(url)
  }

}
