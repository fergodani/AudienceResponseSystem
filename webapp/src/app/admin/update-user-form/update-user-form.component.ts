import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.css']
})
export class UpdateUserFormComponent {

  @Input() user!: User;

  roles = [
    'Estudiante',
    'Profesor'
  ]

  updateUserForm = new FormGroup({
    username: new FormControl(this.user.username),
    password: new FormControl(''),
    role: new FormControl(this.roles.filter(rol => rol == this.user.role))
  })

  onUserUpdateSubmit() {
    
  }
}
