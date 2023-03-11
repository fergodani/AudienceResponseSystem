import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Question } from '@app/core/models/question.model';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent {

  constructor(
    private authService: ApiAuthService,
    private apiProfessorService: ApiProfessorService
    ) {}

  questions: Question[] = [];
  questionsAdded: Question[] = [];
  resourceFile: any = '';
  title = new FormControl('', [
    Validators.required
  ]);

  addQuestion(questionToAdd: Question) {
    if (!this.questionsAdded.includes(questionToAdd))
      this.questionsAdded.push(questionToAdd);
  }

  removeQuestion(questionToRemove: Question) {
    this.questionsAdded = this.questionsAdded.filter(question => question != questionToRemove);
    this.questions.push(questionToRemove);
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
      return;
    }
    const survey = new Survey(
      this.title.value!,
      this.authService.userValue!.id,
      this.questionsAdded,
      this.resourceFile
    )
    this.apiProfessorService
    .createSurvey(survey)
    .subscribe(() => alert("Cuestionario creado"))
    console.log(survey)
  }


}
