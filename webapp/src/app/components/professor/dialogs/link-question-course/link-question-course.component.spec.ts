import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkQuestionCourseComponent } from './link-question-course.component';
import { imports } from '@app/core/services/stubs/imports';
import { QuestionListComponent } from '../../question-list/question-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';

describe('LinkQuestionCourseComponent', () => {
  let component: LinkQuestionCourseComponent;
  let fixture: ComponentFixture<LinkQuestionCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [LinkQuestionCourseComponent, QuestionListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub},
        { provide: ApiAuthService, useClass: AuthServiceStub},
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkQuestionCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
