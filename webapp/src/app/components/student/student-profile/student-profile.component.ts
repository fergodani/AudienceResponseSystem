import { Component, OnInit } from '@angular/core';
import { User, UserResult } from 'src/app/core/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { Answer, AnswerResult } from '@app/core/models/answer.model';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit{

  constructor(
    private authService: ApiAuthService,
    private studentService: ApiStudentService
  ){
    this.authService.user.subscribe(user => this.user = user)
    
  }
  ngOnInit(): void {
    this.loadingResults = true;
    this.studentService
    .getGamesResultsByUser(this.user!.id)
    .subscribe(results => {
      this.results = results; 
      this.loadingResults = false; 
    })
  }

  user: User | null = <User | null>{};
  error = '';
  results: UserResult[] = [];
  loadingResults = false;

  passwordFormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required
    ]),
    passwordBis: new FormControl('', [
      Validators.required
    ]),
    passwordBisConfirm: new FormControl('', [
      Validators.required
    ])
  })

  submitPassword(){
    this.error = '';
    if (this.passwordFormGroup.invalid) {
      this.error = 'Por favor, rellene todos los campos';
      return;
    }
    if(this.passwordFormGroup.value.passwordBis != this.passwordFormGroup.value.passwordBisConfirm) {
      this.error = 'Las contaseñas deben coincidir'
      return;
    }
    const password1 = this.passwordFormGroup.value.password;
    const password2 = this.passwordFormGroup.value.passwordBis;

    this.studentService
    .changePassword(this.user!.id, password1!, password2!)
    .subscribe(msg => alert("Contraseña actualizada"))

  }

}
