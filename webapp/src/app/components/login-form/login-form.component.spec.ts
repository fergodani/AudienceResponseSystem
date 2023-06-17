import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { Router } from '@angular/router';

describe('CreateUserFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports ,
      declarations: [LoginFormComponent],
      providers: [
        { provide: ApiAuthService, useClass: AuthServiceStub}
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginFormGroup.valid).toBeFalsy();
  });

  it('username and password fields validity', () => {
    let username = component.loginFormGroup.controls['username'];
    let password = component.loginFormGroup.controls['password'];
    expect(username.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
  });

  it('submitting admin user emits correctly and navigates to the correct page', inject([Router], (mockRouter: Router) => { 
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    expect(component.loginFormGroup.valid).toBeFalsy();
    component.loginFormGroup.controls['username'].setValue("testUserAdmin");
    component.loginFormGroup.controls['password'].setValue("testPassword");
    expect(component.loginFormGroup.valid).toBeTruthy();
    
    component.submitUser()
    expect(spy.calls.first().args[0]).toContain('/admin/home')
  }));

  it('submitting professor user emits correctly and navigates to the correct page', inject([Router], ( mockRouter: Router) => { 
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    expect(component.loginFormGroup.valid).toBeFalsy();
    component.loginFormGroup.controls['username'].setValue("testUserProfessor");
    component.loginFormGroup.controls['password'].setValue("testPassword");
    expect(component.loginFormGroup.valid).toBeTruthy();
    
    component.submitUser()
    expect(spy.calls.first().args[0]).toContain('/professor/home')
  }));

  it('submitting student user emits correctly and navigates to the correct page', inject([Router], (mockRouter: Router) => { 
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    expect(component.loginFormGroup.valid).toBeFalsy();
    component.loginFormGroup.controls['username'].setValue("testUserStudent");
    component.loginFormGroup.controls['password'].setValue("testPassword");
    expect(component.loginFormGroup.valid).toBeTruthy();
    
    component.submitUser()
    expect(spy.calls.first().args[0]).toContain('/student/home')
  }));
});
