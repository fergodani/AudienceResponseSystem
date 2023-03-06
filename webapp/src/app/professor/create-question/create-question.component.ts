import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Answer } from 'src/app/core/models/answer.model';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent {

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
    pointType: new FormControl(this.pointType[0])
  })
  

  opened: boolean = false;
  events: string[] = [];
  answers: Answer[] = []

  addAnswers(answers: Answer[]){
    this.answers = answers;
    
  }


}
