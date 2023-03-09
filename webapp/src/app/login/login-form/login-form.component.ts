import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { Token, User, UserToken } from 'src/app/core/models/user.model';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(private loginService: ApiAuthService, private router: Router) {}

  loginFormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })



  submitUser() {
    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;
    const user = new User(username!, password!);
    this.loginService
    .login(user)
    .subscribe( token => {
      // guardar en local storage
      const token_decoded = jwt_decode<UserToken>(token.token);
      this.loginService.setUser(token_decoded.user)
      if (token_decoded.user.role == 'student'){
        this.router.navigate(['/student/home'])
      } else if (token_decoded.user.role == 'professor') {
        this.router.navigate(['/professor/home'])
      } else {
        this.router.navigate(['/admin/home'])
      }
    })
  }

}
