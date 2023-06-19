import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { UserResult } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

export interface PeriodicElement {
  survey: string;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  total_answers: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {survey: "Tema 1", score: 2560, correct_answers: 7, wrong_answers: 3, total_answers: 10},
  {survey: "Tema 2", score: 1560, correct_answers: 6, wrong_answers: 1, total_answers: 10},
  {survey: "Tema 3", score: 1476, correct_answers: 10, wrong_answers: 0, total_answers: 10},
  {survey: "Tema 4", score: 560, correct_answers: 5, wrong_answers: 5, total_answers: 10},
  {survey: "Tema 5", score: 5000, correct_answers: 6, wrong_answers: 4, total_answers: 10},
  {survey: "Tema 6", score: 967, correct_answers: 7, wrong_answers: 0, total_answers: 10},
  {survey: "Tema 7", score: 1001, correct_answers: 8, wrong_answers: 0, total_answers: 10},
];

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
      .subscribe(results => {this.results = results; console.log(results)})
    })
  }

  course: Course = <Course>{}
  isLoading = false
  results: UserResult[] = []

  displayedColumns: string[] = ['survey', 'score', 'correct_answers', 'wrong_answers', 'total_answers'];
  dataSource = ELEMENT_DATA;

}
