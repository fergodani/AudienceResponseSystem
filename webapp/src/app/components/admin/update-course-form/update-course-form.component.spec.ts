import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UpdateCourseFormComponent } from './update-course-form.component';

describe('UpdateCourseFormComponent', () => {
  let component: UpdateCourseFormComponent;
  let fixture: ComponentFixture<UpdateCourseFormComponent>;

  beforeEach(() => {
    let paramMap = new Map<number, string>()
    paramMap.set(2, "2")
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [UpdateCourseFormComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        }
      ],
      teardown: {destroyAfterEach: false} 
    }).compileComponents()
    fixture = TestBed.createComponent(UpdateCourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should retrieve course", () => {
    expect(component.course.name).toBe("testCourse")
    expect(component.course.description).toBe("testDescription")
  });

  it('submitting a form emits correctly', inject([ApiService], (apiServiceStub: ApiServiceStub) => { 
    spyOn(apiServiceStub, 'updateCourse').and.returnValue(of({message: "Test"}))
    expect(component.updateCourseForm.valid).toBeTruthy();
    component.updateCourseForm.controls['name'].setValue("newTestCourse");
    component.updateCourseForm.controls['description'].setValue("newTestDescription");
    
    component.onCourseUpdateSubmit()
    expect(apiServiceStub.updateCourse).toHaveBeenCalledWith({
      id: 1,
      name: "newTestCourse",
      description: "newTestDescription"
    })
   
  }));
});
