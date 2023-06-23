import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { imports } from '@app/core/services/stubs/imports';
import { SurveyListComponent } from '../survey-list/survey-list.component';
import { QuestionListComponent } from '../question-list/question-list.component';
import { CourseListComponent } from '@app/components/admin/course-list/course-list.component';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [LibraryComponent, SurveyListComponent, QuestionListComponent, CourseListComponent],
      providers: [
        {provide: ApiService, useClass: ApiServiceStub},
        {provide: ApiProfessorService, useClass: ApiProfessorServiceStub}
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
