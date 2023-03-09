import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute
    ) {
      if(this.authService.userValue) {
        this.router.navigate(['/'])
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
  submitted = false;
  error = '';


  submitUser() {
    this.submitted = true;

    if (this.loginFormGroup.invalid) {
      return;
    }

    this.isLoading = true;

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;
    const user = new User(username!, password!);
    this.authService
    .login(user)
    .pipe(first())
    .subscribe({
      next: () => {     
        if(this.authService.userValue!.role == Role.Student){
          this.router.navigate(['student/home'])
        }else if(this.authService.userValue!.role == Role.Admin){
          this.router.navigate(['admin/home'])
        }else if(this.authService.userValue!.role == Role.Professor){
          this.router.navigate(['professor/home'])
        }
      },
      error: error => {
        this.error = error;
        this.isLoading = false;
      }
    })
  }

}
