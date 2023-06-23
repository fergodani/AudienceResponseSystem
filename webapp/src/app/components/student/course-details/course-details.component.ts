import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { UserResult } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseStudentDetailsComponent implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private studentService: ApiStudentService,
    private authService: ApiAuthService
  ){}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('course_id');
    this.isLoading = true;
    this.apiService
    .getCourse(Number(id))
    .subscribe((course: Course) => {
      this.course = course
      this.isLoading = false
      this.studentService
      .getGamesResultsByUserAndCourse(this.authService.userValue!.id, this.course.id)
      .subscribe(results => {this.results = results;})
    })
  }

  course: Course = <Course>{}
  isLoading = false
  results: UserResult[] = []

  displayedColumns: string[] = ['survey', 'score', 'correct_answers', 'wrong_answers', 'total_answers'];

}
