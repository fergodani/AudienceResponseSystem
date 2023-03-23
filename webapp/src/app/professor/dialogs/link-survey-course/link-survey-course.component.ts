import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Survey } from '@app/core/models/survey.model';

@Component({
  selector: 'app-link-survey-course',
  templateUrl: './link-survey-course.component.html',
  styleUrls: ['./link-survey-course.component.css']
})
export class LinkSurveyCourseComponent {
  constructor(
    public dialogRef: MatDialogRef<LinkSurveyCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public surveysAdded: Survey[],
  ) {
  }

  surveys: Survey[] = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  addSurvey(survey: Survey) {
    if(!this.surveys.includes(survey)){
      this.surveys.push(survey)
    }
  }
}
