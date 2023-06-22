import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CreateSurveyComponent } from './create-survey.component';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { Question, Type } from '@app/core/models/question.model';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { QuestionListComponent } from '../question-list/question-list.component';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';

describe('CreateSurveyComponent', () => {
  let component: CreateSurveyComponent;
  let fixture: ComponentFixture<CreateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CreateSurveyComponent, QuestionListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiAuthService, useClass: AuthServiceStub}
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title invalid when empty', () => {
    expect(component.title.valid).toBeFalsy();
    component.onSurveySubmit()
    expect(component.isTitleError).toBeTruthy()
  });

  it('survey invalid when no questions added', () => {
    const compiled = fixture.debugElement;
    component.title.setValue("title");
    expect(component.title.valid).toBeTruthy();
    expect(compiled.nativeElement.innerHTML).toContain("title");
    component.onSurveySubmit()
    expect(component.isQuestionsError).toBeTruthy()
  });

  it('submitting a survey emits correctly', inject([ApiProfessorService], (apiServiceStub: ApiProfessorServiceStub) => {
    spyOn(apiServiceStub, 'createSurvey').and.returnValue(of({ message: "Test" }))
    component.title.setValue("title");
    const question: Question = {
      id: 1,
      description: "description",
      subject: "subject",
      type: Type.multioption,
      answer_time: 5,
      user_creator_id: 1,
      resource: '',
      answers: []
    }
    component.questionsAdded.push(question)
    component.onSurveySubmit()
    expect(apiServiceStub.createSurvey).toHaveBeenCalled()

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
