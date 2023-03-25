import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Answer} from 'src/app/core/models/answer.model';
import { Type } from 'src/app/core/models/question.model';

const TRUE_FALSE_ANSWERS = 2;
const MULTIOPTION_ANSWERS = 4;

enum Answers {
  answer1,
  answer2
}

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges) {
    if (this.typeString == 'Verdadero o falso') {
      this.type = Type.true_false;
    } else if (this.typeString == 'Multiopción') {
      this.type = Type.multioption;
    } else {
      this.type = Type.short;
    }
  }

  @Input() typeString: string = 'Multiopción';
  @Output() answers = new EventEmitter<Answer[]>;
  type: Type = Type.multioption;
  types = Type;
  selectedOption : string = ''
  answersType = Answers;

  answer1FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    checked: new FormControl(false),
  })
  answer2FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    checked: new FormControl(false),
  })
  answer3FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    checked: new FormControl(false),
  })
  answer4FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    checked: new FormControl(false),
  })
  shortAnswersFormGroup = new FormGroup({
    answer1: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    answer2: new FormControl(''),
    answer3: new FormControl(''),
    answer4: new FormControl(''),
  })

  questionFormArray = new FormArray([
    this.answer1FormGroup,
    this.answer2FormGroup,
    this.answer3FormGroup,
    this.answer4FormGroup
  ])

  changeCheck(checked: boolean, answer: Answers){
    if(this.type != Type.true_false)
      return;
    switch(answer) {
      case Answers.answer1: {
        this.answer2FormGroup.patchValue({checked: !checked});
        break;
      }
      case Answers.answer2: {
        this.answer1FormGroup.patchValue({checked: !checked});
        break;
      }
      default: {
        break;
      }
    }
  }

  submitAnswers(){
    let answers: Answer[] = []
    switch(this.type) {
      case Type.multioption: {
        for(let i = 0; i < MULTIOPTION_ANSWERS; i++){
          let description = this.questionFormArray.controls[i].value.description;
          let checked = this.questionFormArray.controls[i].value.checked;
          answers.push(new Answer(description!, checked!))
        }
        break;        
      }
      case Type.true_false: {
        for(let i = 0; i < TRUE_FALSE_ANSWERS; i++){
          let description = this.questionFormArray.controls[i].value.description;
          let checked = this.questionFormArray.controls[i].value.checked;
          answers.push(new Answer(description!, checked!))
        }
        break;        
      }
      case Type.short: {
        answers.push(new Answer(this.shortAnswersFormGroup.value.answer1!, true));
        if(this.shortAnswersFormGroup.value.answer2! != '')
          answers.push(new Answer(this.shortAnswersFormGroup.value.answer2!, true));
        if(this.shortAnswersFormGroup.value.answer3! != '')
          answers.push(new Answer(this.shortAnswersFormGroup.value.answer3!, true));
        if(this.shortAnswersFormGroup.value.answer4! != '')
          answers.push(new Answer(this.shortAnswersFormGroup.value.answer4!, true));
        break;        
      }
      default: {
        break;
      }
    }
    this.answers.emit(answers)
  }

}
