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
  roles = [
    'Estudiante',
    'Profesor'
  ]
  createUserForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    role: new FormControl(this.roles[0]),
  })

  constructor(private apiService:ApiService, private router:Router){
  }

  isLoading = false

  onUserSubmit() {
    if(this.createUserForm.get("username")?.invalid) {
      return;
    }
    this.isLoading = true
    const username = this.createUserForm.value.username;
    const role = this.createUserForm.value.role;
    const newUser = new User(username!, this.translate(role!));
    this.apiService
    .createUser(newUser)
    .subscribe( (msg: Message) => {alert(msg.message); this.isLoading = false});
  }

  translate(data: string): string {
    if(data == "Estudiante"){
      return 'student'
    }else{
      return 'professor'
    }
  }
}
