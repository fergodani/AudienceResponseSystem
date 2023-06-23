import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStudentDetailsComponent } from './course-details.component';
import { Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiStudentServiceStub } from '@app/core/services/stubs/api.student.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { By } from '@angular/platform-browser';

describe('CourseStudentDetailsComponent', () => {
  let component: CourseStudentDetailsComponent;
  let fixture: ComponentFixture<CourseStudentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CourseStudentDetailsComponent],
      providers: [
        { provide: ApiStudentService, useClass: ApiStudentServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch results on initialization', () => {
    expect(component.results.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it("should show the results", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("testCourse");
    expect(compiled.nativeElement.innerHTML).toContain("testDescription");
    expect(compiled.nativeElement.innerHTML).toContain("Tema1");
    expect(compiled.nativeElement.innerHTML).toContain("Tema1");
    expect(compiled.nativeElement.innerHTML).toContain("Tema2");
    expect(compiled.nativeElement.innerHTML).toContain(1000);
    expect(compiled.nativeElement.innerHTML).toContain(1500);
  })

  it("When survey click should navigate to /game/revision/:game_id/:user_id", () => {
    let href = fixture.debugElement.query(By.css('td a')).nativeElement
      .getAttribute('href');
    expect(href).toEqual('/game/revision/1/1');
  })
});
