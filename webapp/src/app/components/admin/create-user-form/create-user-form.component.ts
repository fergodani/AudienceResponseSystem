import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';


@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent {

  constructor(
    private apiService:ApiService, 
    private router:Router,
    ){
  }

  roles = [
    "student",
    "professor"
  ]
  
  createUserForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    role: new FormControl(this.roles[0], [
      Validators.required
    ]),
  })
  isLoading = false

  onUserSubmit() {
    if(this.createUserForm.get("username")?.invalid || this.createUserForm.get("role")?.invalid ) {
      return;
    }
    
    this.isLoading = true
    const username = this.createUserForm.value.username;
    const role = this.createUserForm.value.role;
    console.log(role)
    const newUser = new User(username!, role!);
    this.apiService
    .createUser(newUser)
    .subscribe( (msg: Message) => {alert(msg.message); this.isLoading = false});
  }
}
