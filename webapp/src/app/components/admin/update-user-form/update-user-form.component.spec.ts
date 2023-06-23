import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { UpdateUserFormComponent } from './update-user-form.component';
import { ActivatedRoute } from '@angular/router';

describe('UpdateUserFormComponent', () => {
  let component: UpdateUserFormComponent;
  let fixture: ComponentFixture<UpdateUserFormComponent>;

  beforeEach(() => {
    let paramMap = new Map<number, string>()
    paramMap.set(2, "2")
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [UpdateUserFormComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(UpdateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should retrieve user", () => {
    expect(component.user.username).toBe("testUser1")
    expect(component.user.role).toBe("student")
  });

  it('submitting a form emits correctly', inject([ApiService], (apiServiceStub: ApiServiceStub) => { 
    spyOn(apiServiceStub, 'updateUser').and.returnValue(of({message: "Test"}))
    expect(component.updateUserForm.valid).toBeTruthy();
    component.updateUserForm.controls['username'].setValue("testUser");
    component.updateUserForm.controls['password'].setValue("testPass");
    component.updateUserForm.controls['role'].setValue("Estudiante");
    
    component.onUserUpdateSubmit()
    expect(apiServiceStub.updateUser).toHaveBeenCalledWith({
      id: 2,
      username: "testUser",
      password: "testPass",
      role: "student"
    })
   
  }));
});
