import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CourseListComponent } from './course-list.component';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { By } from '@angular/platform-browser';
import { imports } from '@app/core/services/stubs/imports';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let alerta: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [CourseListComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alerta = spyOn(window, 'confirm')
  })

  it('should fetch courses on initialization', () => {
    expect(component.courses.length).toBeGreaterThan(0);
    expect(component.isLoading).toBe(false);

  });

  it("should show the courses", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("testCourse1");
    expect(compiled.nativeElement.innerHTML).toContain("descriptionTest1");
    expect(compiled.nativeElement.innerHTML).toContain("testCourse2");
    expect(compiled.nativeElement.innerHTML).toContain("descriptionTest2");
    expect(compiled.queryAll(By.css(".btn-danger")).length).toBe(2); // botones de eliminar curso
  })

  it("onCreateCourse should navigate to /courses/create", inject([Router], (mockRouter: Router) => {
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    component.onCreateCourse()
    expect(spy.calls.first().args[0]).toContain('/courses/create')
  }))

  it("should delete course", () => {
    alerta.and.returnValue(true)
    component.onDeleteCourse(2)
    expect(component.courses.length).toBe(1)
  })

  it('should detect file input change', inject([ApiService], (apiServiceStub: ApiServiceStub) => {
    const dataTransfer = new DataTransfer()

    dataTransfer.items.add(new File([''], 'test-file.csv', { type: "text/csv" }))

    const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(component.fileName).toBeTruthy()
    expect(component.fileName).toBe('test-file.csv')

  }));

  it('file change event should arrive in handler', () => {
    const element = fixture.nativeElement;
    const input = element.querySelector('#file');
    spyOn(component, 'onFileSelected');
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.onFileSelected).toHaveBeenCalled();
  });
});
