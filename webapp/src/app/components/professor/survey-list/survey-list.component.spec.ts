import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SurveyListComponent } from './survey-list.component';
import { Router } from '@angular/router';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { Question } from '@app/core/models/question.model';
import { Survey } from '@app/core/models/survey.model';

describe('SurveyListComponent', () => {
  let component: SurveyListComponent;
  let fixture: ComponentFixture<SurveyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [SurveyListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(SurveyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch surveys on initialization', () => {
    expect(component.surveys.length).toBe(3);
    expect(component.isLoading).toBe(false);
  });

  it("should show the surveys", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("TitleTest1");
    expect(compiled.nativeElement.innerHTML).toContain("TitleTest2");
    expect(compiled.nativeElement.innerHTML).toContain("TitleTest3");
  })

  it("createNewSurvey should navigate to survey/create", inject([Router], (mockRouter: Router) => {
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    component.createNewSurvey()
    expect(spy.calls.first().args[0]).toContain('survey/create')
  }))

  it("should delete survey", () => {
    component.deleteSurvey({id: 1} as Survey)
    expect(component.surveys.length).toBe(2)
  })
});
