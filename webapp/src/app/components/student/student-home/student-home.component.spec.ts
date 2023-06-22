import { ComponentFixture, TestBed} from '@angular/core/testing';
import { imports } from '@app/core/services/stubs/imports';
import { StudentHomeComponent } from './student-home.component';
import { Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { ApiStudentServiceStub } from '@app/core/services/stubs/api.student.service.mock';
import { By } from '@angular/platform-browser';

describe('StudentHomeComponent', () => {
  let component: StudentHomeComponent;
  let fixture: ComponentFixture<StudentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [StudentHomeComponent],
      providers: [
        { provide: ApiStudentService, useClass: ApiStudentServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
  })

  it('should fetch open games on initialization', () => {
    expect(component.games.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it("should show the opened games", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("Tema1");
    expect(compiled.nativeElement.innerHTML).toContain("Tema2");
  })

  it("When course click should navigate to /student/course/details/:id", () => {
    let href = fixture.debugElement.query(By.css('.course a')).nativeElement
      .getAttribute('href');
    expect(href).toEqual('/student/course/details/1');
  })

  it("When game click should navigate to /game/join/:id", () => {
    let href = fixture.debugElement.query(By.css('.game a')).nativeElement
      .getAttribute('href');
    expect(href).toEqual('/game/join/1');
  })
});
