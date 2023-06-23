import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Role, User } from 'src/app/core/models/user.model';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(
    private authService: ApiAuthService,
    private router: Router
    ) {
      if(this.authService.userValue) {
        (async () => {
          await this.navigateToRoleHome();
        })()
      }
    }

  loginFormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  })

  isLoading = false;
  error = '';


  submitUser() {
    if (this.loginFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;
    const user = new User(username!);
    user.password = password!
    this.authService
    .login(user)
    .subscribe({
      next: () => {     
        (async () => {
          await this.navigateToRoleHome();
        })()
      },
      error: error => {
        this.error = error;
        this.isLoading = false;
      }
    })
  }

  async navigateToRoleHome(){
    if(this.authService.userValue!.role == Role.Student){
      await this.router.navigate(['/student/home'])
    }else if(this.authService.userValue!.role == Role.Admin){
      await this.router.navigate(['/admin/home'])
    }else if(this.authService.userValue!.role == Role.Professor){
      await this.router.navigate(['/professor/home'])
    }
  }

}
