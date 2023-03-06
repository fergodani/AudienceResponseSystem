import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Answer, Type } from 'src/app/core/models/answer.model';

const TRUE_FALSE_ANSWERS = 2;
const MULTIOPTION_ANSWERS = 4;

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
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

  answer1FormGroup = new FormGroup({
    description: new FormControl(''),
    checked: new FormControl(false),
  })
  answer2FormGroup = new FormGroup({
    description: new FormControl(''),
    checked: new FormControl(false),
  })
  answer3FormGroup = new FormGroup({
    description: new FormControl(''),
    checked: new FormControl(false),
  })
  answer4FormGroup = new FormGroup({
    description: new FormControl(''),
    checked: new FormControl(false),
  })
  shortAnswersFormGroup = new FormGroup({
    answer1: new FormControl(''),
    answer2: new FormControl(''),
    answer3: new FormControl(''),
    answer4: new FormControl(''),
  })

  answerFormArray = new FormArray([
    this.answer1FormGroup,
    this.answer2FormGroup,
    this.answer3FormGroup,
    this.answer4FormGroup
  ])

  submitAnswers(){
    let answers: Answer[] = []
    switch(this.type) {
      case Type.multioption: {
        for(let i = 0; i < MULTIOPTION_ANSWERS; i++){
          let description = this.answerFormArray.controls[i].value.description;
          let checked = this.answerFormArray.controls[i].value.checked;
          answers.push(new Answer(description!, checked!))
        }
        break;        
      }
      case Type.true_false: {
        for(let i = 0; i < TRUE_FALSE_ANSWERS; i++){
          let description = this.answerFormArray.controls[i].value.description;
          let checked = this.answerFormArray.controls[i].value.checked;
          answers.push(new Answer(description!, checked!))
        }
        break;        
      }
      case Type.short: {
        answers.push(new Answer(this.shortAnswersFormGroup.value.answer1!, true));
        answers.push(new Answer(this.shortAnswersFormGroup.value.answer2!, true));
        answers.push(new Answer(this.shortAnswersFormGroup.value.answer3!, true));
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
