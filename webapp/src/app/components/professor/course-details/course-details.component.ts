import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Course, QuestionCourse, SurveyCourse, UserCourse } from '@app/core/models/course.model';
import { Survey } from '@app/core/models/survey.model';
import { User } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { isEmpty } from 'rxjs';
import { CreateGameDialogComponent } from '../dialogs/create-game-dialog/create-game-dialog.component';
import { LinkQuestionCourseComponent } from '../dialogs/link-question-course/link-question-course.component';
import { LinkSurveyCourseComponent } from '../dialogs/link-survey-course/link-survey-course.component';
import { LinkUserCourseComponent } from '../dialogs/link-user-course/link-user-course.component';
import { Question } from '@app/core/models/question.model';
import { Message } from '@app/core/models/message.model';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseProfessorDetailsComponent {

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
          .subscribe(surveys => {this.surveys = surveys})
        this.apiProfessorService
          .getQuestionsByCourse(this.course.id)
          .subscribe(questions => {this.questions = questions})
      })
  }

  course: Course = <Course>{};
  users: User[] = [];
  surveys: Survey[] = [];
  questions: Question[] = []

  openUserDialog(): void {
    const dialogRef = this.dialog.open(LinkUserCourseComponent, {
      data: this.users,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        return
      if (result.length != 0) {
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
    const dialogRef = this.dialog.open(LinkQuestionCourseComponent, {
      data: this.questions,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        return
      if (result.length != 0) {
        this.addQuestionsToCourse(result)
      }

    })
  }

  addQuestionsToCourse(questionsToAdd: Question[]) {
    const questionToCourse: QuestionCourse = {
      course_id: this.course.id,
      questions: questionsToAdd
    }
    this.apiService
    .addQuestionToCourse(questionToCourse)
    .subscribe((msg: Message) => alert(msg.message))
  }

  openCreateOnlineGameDialog(survey_id: number): void {
    this.dialog.open(CreateGameDialogComponent, {
      data: { course_id: this.course.id, survey_id}
    });
  }

  deleteSurveyFromCourse(survey: Survey) {
    this.apiProfessorService
    .deleteSurveyFromCourse(this.course.id, survey.id!)
    .subscribe((msg: Message) =>{
      alert(msg.message)
      this.surveys = this.surveys.filter((s) => s.id != survey.id)
    })
  }

  deleteQuestionFromCourse(question: Question) {
    this.apiProfessorService
    .deleteQuestionFromCourse(this.course.id, question.id)
    .subscribe((msg: Message) =>{
      alert(msg.message)
      this.questions = this.questions.filter((q) => q.id != question.id)
    })
  }

  deleteUserFromCourse(user: User) {
    this.apiProfessorService
    .deleteUserFromCourse(this.course.id, user.id)
    .subscribe((msg: Message) =>{
      alert(msg.message)
      this.users = this.users.filter((u) => u.id != user.id)
    })
  }
}
