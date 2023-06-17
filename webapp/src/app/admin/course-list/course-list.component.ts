import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: ApiAuthService
  ) {
    this.authService.user.subscribe(user => this.user = user)
  }

  courses: Course[] = [];
  fileName: string = ''
  requiredFileType = "text/csv";
  isLoading: boolean = true;
  user: User | null = <User | null>{};

  ngOnInit(): void {
    this.apiService
      .getCourses()
      .subscribe(courses => { this.courses = courses; this.isLoading = false; console.log(courses) })
  }

  async onCreateCourse() {
    await this.router.navigate(["/courses/create"])
  }

  onDeleteCourse(id: number) {
    this.courses = this.courses.filter(course => course.id != id)
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

  get isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  get isProfessor() {
    return this.user && this.user.role === 'professor';
  }


}
