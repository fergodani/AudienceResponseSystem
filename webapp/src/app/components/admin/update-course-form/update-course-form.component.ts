import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { Course } from 'src/app/core/models/course.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-update-course-form',
  templateUrl: './update-course-form.component.html',
  styleUrls: ['./update-course-form.component.css']
})
export class UpdateCourseFormComponent implements OnInit{
  
  constructor(
    private apiService: ApiService, 
    private actRoute: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.apiService
    .getCourse(Number(id))
    .subscribe(
      course => {
        this.course = course;
      }
    )
  }

  course: Course = new Course('', '')

  updateCourseForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  })

  fileName: any = '';
  resourceFile: any = '';

  onCourseUpdateSubmit() {
    this.course.name = this.updateCourseForm.value.name != "" ? this.updateCourseForm.value.name! : this.course.name;
    this.course.description = this.updateCourseForm.value.description != "" ? this.updateCourseForm.value.description! : this.course.description;
    if (this.resourceFile != '')
      this.course.image = this.resourceFile
    this.apiService
    .updateCourse(this.course)
    .subscribe( (msg: Message) =>{
      alert(msg.message)
      this.router.navigate(["/courses"])
    })
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
