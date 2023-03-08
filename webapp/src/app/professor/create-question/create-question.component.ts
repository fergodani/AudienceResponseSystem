import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'rxjs';
import { Answer } from 'src/app/core/models/answer.model';
import { Question, Type } from 'src/app/core/models/question.model';
import { ApiProfessorService } from 'src/app/core/services/professor/api.professor.service';

const MANDATORY_FIELDS = "Debes rellenar los campos obligatorios";
const NO_CORRECT_ANSWER = "Debe haber al menos una respuesta correcta";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent {

  constructor(private apiProfessorService: ApiProfessorService) {}

  types = [
    'Multiopción',
    'Verdadero o falso',
    'Respuesta corta'
  ]
  createQuestionForm = new FormGroup({
    type: new FormControl(this.types[0]),
    limitTime: new FormControl(0),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
  })
  

  opened: boolean = false;
  events: string[] = [];
  answers: Answer[] = [];
  error: boolean = false;
  errorMessage: string = '';

  addAnswers(answers: Answer[]){
    this.error = false;
    const question = new Question(
      this.createQuestionForm.value.description!,
      'subject',
      this.getType(this.createQuestionForm.value.type!),
      this.createQuestionForm.value.limitTime!,
      answers
    );
    console.log(question)
    if (question.description == '' || !this.checkAnswersDescription(answers)){
      this.error = true;
      this.errorMessage = MANDATORY_FIELDS;
    } else if (!this.checkAtLeastOneCorrect(answers)) {
      this.error = true;
      this.errorMessage = NO_CORRECT_ANSWER;
    } else {
      this.error = false;
      console.log(question)
    }
    //this.apiProfessorService
    //.createQuestion(question)
    //.subscribe(msg => alert("Pregunta creada"))
  }

  checkAnswersDescription(answers: Answer[]): boolean{
    let allChecked = true;
    answers.forEach( answer => {
      if (answer.description == ''){
        allChecked = false;
      }
    })
    console.log("All answers checked: " + allChecked)
    return allChecked;
  }

  checkAtLeastOneCorrect(answers: Answer[]): boolean {
    let isAtLeastOneCorrect = false;
    answers.forEach( answer => {
      if (answer.is_correct){
        isAtLeastOneCorrect = true;
      }
    })
    console.log("At least one correct: " + isAtLeastOneCorrect)
    return isAtLeastOneCorrect;
  }

  getType(type: string): string {
    switch(type) {
      case "Multiopción": {
        return 'multioption';
      }
      case "Verdadero o falso": {
        return 'true_false';
      }
      case "Respuesta corta": {
        return 'short';
      }
      default: {
        return 'multioption';
      }
    }
  }

}
