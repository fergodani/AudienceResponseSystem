import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CreateQuestionComponent } from './create-question.component';
import { Type } from '@angular/core';
import { Question } from '@app/core/models/question.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { of } from 'rxjs';
import { Answer } from '@app/core/models/answer.model';
import { AnswersComponent } from './answers/answers.component';

describe('CreateQuestionComponent', () => {
  let component: CreateQuestionComponent;
  let answerComponent: AnswersComponent;
  let fixture: ComponentFixture<CreateQuestionComponent>;
  let fixtureAnswers: ComponentFixture<AnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CreateQuestionComponent, AnswersComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiAuthService, useClass: AuthServiceStub}
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if any filed required is missing', () => {
    const answer: Answer = {
      id: 1,
      description: "testAnswer",
      is_correct: true
    }
    component.createQuestion([answer])
    expect(component.isRequiredFieldsError).toBeTruthy()
  });

  it('should show error if there is no correct answer', () => {
    const answer: Answer = {
      id: 1,
      description: "testAnswer",
      is_correct: false
    }
    const answer2: Answer = {
      id: 1,
      description: "testAnswer",
      is_correct: false
    }
    component.createQuestionForm.get("description")?.setValue("description")
    component.createQuestion([answer, answer2])
    expect(component.isCorrectAnswerError).toBeTruthy()
  });

  it('should show error if limit time is less than 5 seconds', inject([ApiProfessorService], (apiServiceStub: ApiProfessorServiceStub) => {
    const answer: Answer = {
      id: 1,
      description: "testAnswer",
      is_correct: true
    }
    const answer2: Answer = {
      id: 1,
      description: "testAnswer",
      is_correct: false
    }
    component.createQuestionForm.get("description")?.setValue("description")
    component.createQuestionForm.get("limitTime")?.setValue(2)
    component.createQuestion([answer, answer2])
    expect(component.isLimitTimeError).toBeTruthy()

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
