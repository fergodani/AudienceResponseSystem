import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Answer } from 'src/app/core/models/answer.model';
import { Question, Type } from 'src/app/core/models/question.model';
import { ApiProfessorService } from 'src/app/core/services/professor/api.professor.service';

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
  pointType = [
    'Estándar',
    'Puntos dobles',
    'Sin puntos'
  ]
  createQuestionForm = new FormGroup({
    type: new FormControl(this.types[0]),
    limitTime: new FormControl(0),
    pointType: new FormControl(this.pointType),
    description: new FormControl('')
  })
  

  opened: boolean = false;
  events: string[] = [];
  answers: Answer[] = []

  addAnswers(answers: Answer[]){
    const question = new Question(
      this.createQuestionForm.value.description!,
      'subject',
      this.getType(this.createQuestionForm.value.type!),
      this.createQuestionForm.value.limitTime!,
      answers
    );
    this.apiProfessorService
    .createQuestion(question)
    .subscribe(msg => alert("Pregunta creada"))
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
