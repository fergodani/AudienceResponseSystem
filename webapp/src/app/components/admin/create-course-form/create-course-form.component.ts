import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-create-course-form',
  templateUrl: './create-course-form.component.html',
  styleUrls: ['./create-course-form.component.css']
})
export class CreateCourseFormComponent {

  createCourseForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ])
  })

  fileName: any = '';
  resourceFile: any = '';

  constructor(private apiService: ApiService, private router: Router) {
  }

  onCourseSubmit() {
    if(this.createCourseForm.get("name")?.invalid || this.createCourseForm.get("description")?.invalid ) {
      return;
    }
    const name = this.createCourseForm.value.name;
    const description = this.createCourseForm.value.description;
    const newCourse = new Course(name!, description!);
    newCourse.image = this.resourceFile;
    this.apiService
      .createCourse(newCourse)
      .subscribe((msg: Message) => {
        alert(msg.message)
        this.router.navigate(["/courses"])
      });
  }

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];
    this.fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.resourceFile = reader.result;
    }
    reader.onerror = function (error) {
      console.log("Error ", error)
    }
  }
}

