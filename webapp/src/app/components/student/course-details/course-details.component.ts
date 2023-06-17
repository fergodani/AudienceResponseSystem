import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { ApiService } from '@app/core/services/admin/api.admin.service';

export interface PeriodicElement {
  survey: string;
  score: number;
  mark: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {survey: "Tema 1", score: 2560, mark: 8},
  {survey: "Tema 2", score: 1560, mark: 7.56},
  {survey: "Tema 3", score: 1476, mark: 7.4},
  {survey: "Tema 4", score: 560, mark: 3.57},
  {survey: "Tema 5", score: 5000, mark: 10},
  {survey: "Tema 6", score: 967, mark: 5},
  {survey: "Tema 7", score: 1001, mark: 6},
];

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseStudentDetailsComponent implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private apiService: ApiService
  ){}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('course_id');
    this.isLoading = true;
    this.apiService
    .getCourse(Number(id))
    .subscribe((course: Course) => {
      this.course = course
      this.isLoading = false
    })
  }

  course: Course = <Course>{}
  isLoading = false

  displayedColumns: string[] = ['survey', 'score', 'mark'];
  dataSource = ELEMENT_DATA;

}
