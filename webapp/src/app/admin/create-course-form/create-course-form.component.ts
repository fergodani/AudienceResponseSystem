import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/api.admin.service';

@Component({
  selector: 'app-create-course-form',
  templateUrl: './create-course-form.component.html',
  styleUrls: ['./create-course-form.component.css']
})
export class CreateCourseFormComponent {
  
  createCourseForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  })

  constructor(private apiService:ApiService, private router: Router){
  }

  onCourseSubmit() {
    const name = this.createCourseForm.value.name;
    const description = this.createCourseForm.value.description;
    const newCourse = new Course(name!, description!);
    this.apiService
    .createCourse(newCourse)
    .subscribe(msg => alert("Curso creado"));
  }
}
