import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


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
    username: new FormControl(''),
    role: new FormControl(this.roles[3]),
  })

  onUserSubmit() {
    // TODO: hacer fichero api y llamarlo desde aquí para crear usuario
    console.warn(this.createUserForm.value);
  }
}
