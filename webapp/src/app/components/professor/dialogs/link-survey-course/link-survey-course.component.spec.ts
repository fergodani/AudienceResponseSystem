import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSurveyCourseComponent } from './link-survey-course.component';
import { imports } from '@app/core/services/stubs/imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SurveyListComponent } from '../../survey-list/survey-list.component';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';

describe('LinkSurveyCourseComponent', () => {
  let component: LinkSurveyCourseComponent;
  let fixture: ComponentFixture<LinkSurveyCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [LinkSurveyCourseComponent, SurveyListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub},
        { provide: ApiAuthService, useClass: AuthServiceStub},
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(LinkSurveyCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
