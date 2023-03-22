import { Component } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent {

  constructor(
    private authService: ApiAuthService,
    private studentService: ApiStudentService
  ){
    this.authService.user.subscribe(user => this.user = user)
  }

  user: User | null = <User | null>{};
  error = '';

  passwordFormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required
    ]),
    passwordBis: new FormControl('', [
      Validators.required
    ])
  })

  submitPassword(){
    this.error = '';
    if (this.passwordFormGroup.invalid) {
      this.error = 'Por favor, rellene todos los campos';
      return;
    }
    const password1 = this.passwordFormGroup.value.password;
    const password2 = this.passwordFormGroup.value.passwordBis;
    if (password1 != password2) {
      this.error = "Las contraseñas deben coincidir";
      return;
    }
    this.studentService
    .changePassword(this.user!.id, this.passwordFormGroup.value.password!)
    .subscribe(msg => alert("Contraseña actualizada"))

  }
}
