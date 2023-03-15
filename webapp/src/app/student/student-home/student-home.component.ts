import { Component } from '@angular/core';
import { Course } from '@app/core/models/course.model';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {

  constructor(
    private apiStudentService: ApiStudentService,
    private apiProfessorService: ApiProfessorService,
    private authService: ApiAuthService
  ) {
    this.isLoading = true;
    this.apiStudentService
    .getCoursesByUser(this.authService.userValue!.id)
    .subscribe(courses => {
      this.courses = courses; 
      this.isLoading = false;
      courses.forEach( course => {
        this.apiProfessorService
        .getSurveysByCourse(course.id)
        .subscribe( surveys => {this.surveys = this.surveys.concat(surveys); console.log(surveys)})
      })
    })
  }

  courses: Course[] = [];
  isLoading: boolean = false;
  surveys: Survey[] = [];

}
