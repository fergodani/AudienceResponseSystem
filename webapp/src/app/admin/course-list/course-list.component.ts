import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router,  private route: ActivatedRoute) { }

  courses: Course[] = [];
  fileName: string = ''
  requiredFileType = "text/csv";
  isLoading: boolean = true;

  ngOnInit(): void {
    this.apiService
      .getCourses()
      .subscribe(courses => {this.courses = courses; this.isLoading = false})
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

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];

    // TODO: comprobar de otra manera, si file es null daria error esto creo
    if (file && file.type == this.requiredFileType) {
      this.fileName = file.name;
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      console.log(formData.get('file'))
      this.apiService
      .uploadCourseFile(formData)
      .subscribe(msg => alert("Archivo subido correctamente"))
    }
  }


}
