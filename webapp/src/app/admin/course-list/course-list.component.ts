import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/api.admin.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router,  private route: ActivatedRoute) { }

  courses: Course[] = [];

  ngOnInit(): void {
    this.apiService
      .getCourses()
      .subscribe(courses => this.courses = courses)
  }

  onCreateCourse() {
    this.router.navigate(["/courses/create"])
  }

  onDeleteCourse(id: number) {
    this.courses = this.courses.filter( course => course.id != id)
    this.apiService
    .deleteCourse(id)
    .subscribe()
  }


}
