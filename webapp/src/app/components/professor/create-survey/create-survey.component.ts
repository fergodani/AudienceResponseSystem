import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { Question } from '@app/core/models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit{

  constructor(
    private authService: ApiAuthService,
    private apiProfessorService: ApiProfessorService,
    private router: Router
    ) {}

  ngOnInit(): void {
    if (this.surveyToEdit != undefined) {
      this.title.patchValue(this.surveyToEdit.title)
      this.surveyToEdit.questionsSurvey.forEach((qS) => {
        this.questionsAdded.push(qS.question)
      })
    }
  }

  questions: Question[] = [];
  questionsAdded: Question[] = [];
  resourceFile: any = '';
  title = new FormControl('', [
    Validators.required
  ]);
  isTitleError = false;
  isQuestionsError = false;

  @Input() isEditing = false
  @Input() surveyToEdit: Survey | undefined

  addQuestion(questionToAdd: Question) {
      this.questionsAdded.push(questionToAdd);
  }

  removeQuestion(index: number) {
    //this.questionsAdded = this.questionsAdded.filter(question => question != questionToRemove);
    this.questionsAdded = this.questionsAdded.filter((question, i) => i != index);
    //this.questions.push(questionToRemove);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questionsAdded, event.previousIndex, event.currentIndex);
  }

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.resourceFile = reader.result;
    }
    reader.onerror = function (error) {
      console.log("Error ", error)
    }
  }

  removeFile() {
    this.resourceFile = '';
  }

  onSurveySubmit() {
    if (this.title.invalid) {
      this.isQuestionsError = false;
      this.isTitleError = true
      return;
    }
    if (this.questionsAdded.length == 0) {
      this.isQuestionsError = true;
      this.isTitleError = false
      return;
    }
    this.isQuestionsError = false;
      this.isTitleError = false
    for(let i = 0; i < this.questionsAdded.length ; i++){
      this.questionsAdded[i].position = i;
    }
    const survey = new Survey(
      this.title.value!,
      this.authService.userValue!.id,
      this.questionsAdded,
      this.resourceFile
    )
    if (!this.isEditing){
      this.apiProfessorService
      .createSurvey(survey)
      .subscribe((msg: Message) => alert(msg.message))
    }else {
      survey.id = this.surveyToEdit?.id
      this.apiProfessorService
      .updateSurvey(survey)
      .subscribe((msg: Message) => {
        alert(msg.message)
        
      })
    }
    this.backToLibrary()
  }

  async backToLibrary() {
    await this.router.navigate(['/library'])
  }

}
