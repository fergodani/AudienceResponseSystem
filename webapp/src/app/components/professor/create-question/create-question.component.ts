import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'rxjs';
import { Answer } from 'src/app/core/models/answer.model';
import { Question, Type } from 'src/app/core/models/question.model';
import { ApiProfessorService } from 'src/app/core/services/professor/api.professor.service';

const MANDATORY_FIELDS = "Debes rellenar los campos obligatorios";
const NO_CORRECT_ANSWER = "Debe haber una respuesta correcta";
const LIMIT_TIME = "El tiempo tiene que ser al menos 5 segundos";

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
  ) {
   }

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
      this.createQuestionForm.patchValue({
        type,
        description: this.questionToEdit.description,
        limitTime: this.questionToEdit.answer_time
      })
      console.log(this.questionToEdit)
      if(this.questionToEdit.resource != null)
        this.resourceFile = this.questionToEdit.resource
    }
  }

  opened: boolean = false;
  events: string[] = [];
  answers: Answer[] = [];
  isRequiredFieldsError: boolean = false;
  isCorrectAnswerError: boolean = false;
  isLimitTimeError: boolean = false;
  isFileError: boolean = false;
  resourceFile: string = '';
  @Input() isEditing = false;
  @Input() questionToEdit: Question | undefined

  types = [
    'multioption',
    'true_false',
    'short'
  ]
  createQuestionForm = new FormGroup({
    type: new FormControl(this.types[0]),
    limitTime: new FormControl(0),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
  })

  async createQuestion(answers: Answer[]) {
    this.isCorrectAnswerError = false;
    this.isLimitTimeError = false;
    this.isRequiredFieldsError = false;
    const question = new Question(
      this.createQuestionForm.value.description!,
      'subject',
      this.createQuestionForm.value.type!,
      this.createQuestionForm.value.limitTime!,
      answers,
      this.resourceFile,
      this.authService.userValue!.id
    );
    if (question.description == '' || !this.checkAnswersDescription(answers)) {
      this.isRequiredFieldsError = true;
      return
    } else if (!this.checkAtLeastOneCorrect(answers)) {
      console.log(answers)
      this.isCorrectAnswerError = true;
      return
    }else if(question.answer_time < 5) {
      this.isLimitTimeError = true;
      return;
    }
    if (!this.isEditing) {
      this.apiProfessorService
      .createQuestion(question)
      .subscribe((msg: Message) => {alert(msg.message)})
    } else {
      question.id = this.questionToEdit!.id
      this.apiProfessorService
      .updateQuestion(question)
      .subscribe((msg: Message) => alert(msg.message))
    }
    await this.router.navigate(['/library'])
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

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];
    if (file.type.match(/image\/*/) == null) {
      this.isFileError = true;
			return;
		}
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.resourceFile = reader.result as string;
    }
    reader.onerror = function (error) {
      console.log("Error ", error)
    }
  }

  removeFile() {
    this.resourceFile = '';
  }

  async backToLibrary() {
    await this.router.navigate(['/library'])
  }

}
