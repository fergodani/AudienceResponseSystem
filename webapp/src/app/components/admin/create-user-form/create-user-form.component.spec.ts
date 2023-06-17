import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CreateUserFormComponent } from './create-user-form.component';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';

describe('CreateUserFormComponent', () => {
  let component: CreateUserFormComponent;
  let fixture: ComponentFixture<CreateUserFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports ,
      declarations: [CreateUserFormComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub}
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.createUserForm.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let username = component.createUserForm.controls['username'];
    expect(username.valid).toBeFalsy();
  });

  it('submitting a form emits correctly', inject([ApiService], (apiServiceStub: ApiServiceStub) => { 
    spyOn(apiServiceStub, 'createUser').and.returnValue(of({message: "Test"}))
    expect(component.createUserForm.valid).toBeFalsy();
    component.createUserForm.controls['username'].setValue("testUser");
    expect(component.createUserForm.valid).toBeTruthy();
    
    component.onUserSubmit()
    expect(apiServiceStub.createUser).toHaveBeenCalled()
   
  }));
});
