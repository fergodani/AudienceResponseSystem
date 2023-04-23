import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
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
export class CreateQuestionComponent implements OnInit{

  constructor(
    private apiProfessorService: ApiProfessorService,
    private authService: ApiAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.questionToEdit != undefined) {
      let type
      if (this.questionToEdit.type == 'true_false') {
        type = this.types[1];
      } else if (this.questionToEdit.type == 'multioption') {
        type = this.types[0];
      } else {
        type = this.types[2];
      }
      console.log(type)
      this.createQuestionForm.patchValue({
        type,
        description: this.questionToEdit.description,
        limitTime: this.questionToEdit.answer_time
      })
      if(this.questionToEdit.resource != '')
        this.resourceFile = this.questionToEdit.resource
    }
  }

  opened: boolean = false;
  events: string[] = [];
  answers: Answer[] = [];
  error: boolean = false;
  errorMessage: string = '';
  resourceFile: any = '';
  @Input() isEditing = false;
  @Input() questionToEdit: Question | undefined

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

  addAnswers(answers: Answer[]) {
    this.error = false;
    const question = new Question(
      this.createQuestionForm.value.description!,
      'subject',
      this.getType(this.createQuestionForm.value.type!),
      this.createQuestionForm.value.limitTime!,
      answers,
      this.resourceFile,
      this.authService.userValue!.id
    );
    if (question.description == '' || !this.checkAnswersDescription(answers)) {
      this.error = true;
      this.errorMessage = MANDATORY_FIELDS;
    } else if (!this.checkAtLeastOneCorrect(answers)) {
      this.error = true;
      this.errorMessage = NO_CORRECT_ANSWER;
    } else {
      this.error = false;
    }
    if (!this.isEditing) {
      this.apiProfessorService
      .createQuestion(question)
      .subscribe(msg => alert("Pregunta creada"))
    } else {
      question.id = this.questionToEdit!.id
      this.apiProfessorService
      .updateQuestion(question)
      .subscribe((msg: Message) => alert(msg.message))
    }
    this.router.navigate(['/library'])
  }

  checkAnswersDescription(answers: Answer[]): boolean {
    let allChecked = true;
    answers.forEach(answer => {
      if (answer.description == '') {
        allChecked = false;
      }
    })
    console.log("All answers checked: " + allChecked)
    return allChecked;
  }

  checkAtLeastOneCorrect(answers: Answer[]): boolean {
    let isAtLeastOneCorrect = false;
    answers.forEach(answer => {
      if (answer.is_correct) {
        isAtLeastOneCorrect = true;
      }
    })
    console.log("At least one correct: " + isAtLeastOneCorrect)
    return isAtLeastOneCorrect;
  }

  getType(type: string): string {
    switch (type) {
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

}
