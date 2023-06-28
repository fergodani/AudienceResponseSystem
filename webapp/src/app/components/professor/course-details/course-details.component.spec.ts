import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseProfessorDetailsComponent } from './course-details.component';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';

describe('CourseProfessorDetailsComponent', () => {
  let component: CourseProfessorDetailsComponent;
  let fixture: ComponentFixture<CourseProfessorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [CourseProfessorDetailsComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiAuthService, useClass: AuthServiceStub},
        { provide: ApiService, useClass: ApiServiceStub},
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(CourseProfessorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should fetch course, users, answers, students and games played", () => {
    expect(component.course).not.toBeNull()
    expect(component.course.name).toBe("testCourse")
    expect(component.course.description).toBe("testDescription")
    expect(component.users.length).toBe(2)
    expect(component.questions.length).toBe(2)
    expect(component.surveys.length).toBe(2)
    expect(component.games.length).toBe(2)
  })

  it("should show the entities fetches", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("testCourse");
    expect(compiled.nativeElement.innerHTML).toContain("testDescription");
    expect(component.surveys[0].title).toBe("survey1");
    expect(component.surveys[1].title).toBe("survey2");
    expect(component.users[0].username).toBe("user1");
    expect(component.users[1].username).toBe("user2");
    expect(component.questions[0].description).toBe("question 1");
    expect(component.questions[1].description).toBe("question 2");
    expect(component.games[0].survey!.title).toBe("game1");
    expect(component.games[1].survey!.title).toBe("game2");
  })
});
