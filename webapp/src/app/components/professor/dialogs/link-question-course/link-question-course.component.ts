import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Question } from '@app/core/models/question.model';

@Component({
  selector: 'app-link-question-course',
  templateUrl: './link-question-course.component.html',
  styleUrls: ['./link-question-course.component.css']
})
export class LinkQuestionCourseComponent {
  constructor(
    public dialogRef: MatDialogRef<LinkQuestionCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public questionsAdded: Question[]
  ) {
  }

  questions: Question[] = [];

  onNoClick(): void {
    const questionsIds = this.questions.map(q => q.id)
    this.questionsAdded = this.questionsAdded.filter(q => !questionsIds.includes(q.id))
    this.dialogRef.close();
  }

  addQuestion(question: Question) {
    if (!this.questions.includes(question)) {
      this.questions.push(question)
    }
  }
}
