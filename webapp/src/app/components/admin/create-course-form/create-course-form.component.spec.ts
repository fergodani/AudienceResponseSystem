import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { CreateCourseFormComponent } from './create-course-form.component';

describe('CreateCourseFormComponent', () => {
  let component: CreateCourseFormComponent;
  let fixture: ComponentFixture<CreateCourseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports ,
      declarations: [CreateCourseFormComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub}
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(CreateCourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.createCourseForm.valid).toBeFalsy();
  });

  it('name and description fields validity', () => {
    let username = component.createCourseForm.controls['name'];
    let description = component.createCourseForm.controls['description']
    expect(username.valid).toBeFalsy();
    expect(description.valid).toBeFalsy();
  });

  it('submitting a form emits correctly', inject([ApiService], (apiServiceStub: ApiServiceStub) => { 
    spyOn(apiServiceStub, 'createCourse').and.returnValue(of({message: "Test"}))
    expect(component.createCourseForm.valid).toBeFalsy();
    component.createCourseForm.controls['name'].setValue("testCourse");
    component.createCourseForm.controls['description'].setValue("testDescription");
    expect(component.createCourseForm.valid).toBeTruthy();
    
    component.onCourseSubmit()
    expect(apiServiceStub.createCourse).toHaveBeenCalled()
   
  }));
});
