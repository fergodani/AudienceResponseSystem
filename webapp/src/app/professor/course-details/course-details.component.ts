import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Course, SurveyCourse, UserCourse } from '@app/core/models/course.model';
import { Survey } from '@app/core/models/survey.model';
import { User } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { isEmpty } from 'rxjs';
import { CreateGameDialogComponent } from '../dialogs/create-game-dialog/create-game-dialog.component';
import { LinkQuestionCourseComponent } from '../dialogs/link-question-course/link-question-course.component';
import { LinkSurveyCourseComponent } from '../dialogs/link-survey-course/link-survey-course.component';
import { LinkUserCourseComponent } from '../dialogs/link-user-course/link-user-course.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {

  constructor(
    private apiService: ApiService,
    private apiProfessorService: ApiProfessorService,
    private actRoute: ActivatedRoute,
    public dialog: MatDialog) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.apiService
      .getCourse(Number(id))
      .subscribe(course => {
        this.course = course
        this.apiProfessorService
          .getUsersByCourse(this.course.id)
          .subscribe(users => this.users = users)
        this.apiProfessorService
          .getSurveysByCourse(this.course.id)
          .subscribe(surveys => {this.surveys = surveys; console.log(surveys)})
      })
  }

  course: Course = <Course>{};
  users: User[] = [];
  surveys: Survey[] = [];

  openUserDialog(): void {
    const dialogRef = this.dialog.open(LinkUserCourseComponent, {
      data: this.users,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        return
      if (result.length != 0) {
        this.users.push(result)
        this.addUserToCourse(result);
      }
    })
  }

  addUserToCourse(usersToAdd: User[]) {
    const userToCourse: UserCourse = {
      course_id: this.course.id,
      users: usersToAdd
    }
    this.apiService
      .addUserToCourse(userToCourse)
      .subscribe(msg => alert("Usuario/s añadidos"))
  }

  openSurveyDialog(): void {
    const dialogRef = this.dialog.open(LinkSurveyCourseComponent, {
      data: this.surveys,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        return
      if (result.length != 0) {
        console.log(result)
        this.surveys.push(result);
        this.addSurveyToCourse(result)
      }

    })
  }

  addSurveyToCourse(surveysToAdd: Survey[]) {
    const surveyToCourse: SurveyCourse = {
      course_id: this.course.id,
      surveys: surveysToAdd
    }
    this.apiService
      .addSurveyToCourse(surveyToCourse)
      .subscribe(msg => alert("Cuestionario/s añadido/s"))
  }

  openQuestionDialog(): void {
    this.dialog.open(LinkQuestionCourseComponent);
  }

  openCreateOnlineGameDialog(): void {
    this.dialog.open(CreateGameDialogComponent, {
      data: this.course.id,
    });
  }
}
