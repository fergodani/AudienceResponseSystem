import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { User } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.css']
})
export class UpdateUserFormComponent implements OnInit {

  constructor(private apiService: ApiService, private actRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.apiService
    .getUser(Number(id))
    .subscribe(
      user => {
        this.user = user;
      })
  }
  
  user: User = new User('', '', '');

  roles = [
    'Estudiante',
    'Profesor'
  ]

  updateUserForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl()
  })

  onUserUpdateSubmit() {
    this.user.username = this.updateUserForm.value.username != "" ? this.updateUserForm.value.username! : this.user.username;
    this.user.password = this.updateUserForm.value.password != "" ? this.updateUserForm.value.password! : this.user.password;
    this.user.role =  this.translate(this.updateUserForm.value.role ?? this.user.role)
    this.apiService
    .updateUser(this.user)
    .subscribe((msg: Message) => alert(msg.message))
  }

  translate(data: string): string {
    if(data == "Estudiante"){
      return 'student'
    }else if(data == "Profesor"){
      return 'professor'
    }else {
      return ""
    }
  }
}
