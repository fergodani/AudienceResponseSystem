import { Component } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-link-question-course',
  templateUrl: './link-question-course.component.html',
  styleUrls: ['./link-question-course.component.css']
})
export class LinkQuestionCourseComponent {
  constructor(
    public dialogRef: MatDialogRef<LinkQuestionCourseComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
