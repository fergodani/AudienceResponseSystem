import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileComponent } from './student-profile.component';
import { Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiStudentServiceStub } from '@app/core/services/stubs/api.student.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [StudentProfileComponent],
      providers: [
        { provide: ApiStudentService, useClass: ApiStudentServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user results on initialization', () => {
    expect(component.results.length).toBe(2)
  });

  it("should show the results", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("SO");
    expect(compiled.nativeElement.innerHTML).toContain("ASR");
    expect(compiled.nativeElement.innerHTML).toContain("Tema1");
    expect(compiled.nativeElement.innerHTML).toContain("Tema2");
  })

  it('form invalid when empty', () => {
    expect(component.passwordFormGroup.valid).toBeFalsy();
  });

  it('username and password fields validity', () => {
    let username = component.passwordFormGroup.controls['password'];
    let password = component.passwordFormGroup.controls['passwordBis'];
    expect(username.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
  });

  it('submitting correctly with both password', () => { 
    expect(component.passwordFormGroup.valid).toBeFalsy();
    component.passwordFormGroup.controls['password'].setValue("testPassword");
    component.passwordFormGroup.controls['passwordBis'].setValue("newTestPassword");
    expect(component.passwordFormGroup.valid).toBeTruthy();
  });
});
