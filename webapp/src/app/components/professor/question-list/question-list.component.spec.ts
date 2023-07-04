import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { QuestionListComponent } from './question-list.component';
import { Router } from '@angular/router';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { By } from '@angular/platform-browser';
import { Question } from '@app/core/models/question.model';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;
  let alerta: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [QuestionListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alerta = spyOn(window, 'confirm')
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch questions on initialization', () => {
    expect(component.questions.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it("should show the questions", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("question 1");
    expect(compiled.nativeElement.innerHTML).toContain("question 2");
    expect(compiled.nativeElement.innerHTML).toContain("answer 1 1");
    expect(compiled.nativeElement.innerHTML).toContain("answer 1 2");
    expect(compiled.nativeElement.innerHTML).toContain("answer 2 1");
    expect(compiled.nativeElement.innerHTML).toContain("answer 2 2");
  })

  it("createNewQuestion should navigate to /questions/create", inject([Router], (mockRouter: Router) => {
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    component.createNewQuestion()
    expect(spy.calls.first().args[0]).toContain('/questions/create')
  }))

  it("should delete question", () => {
    alerta.and.returnValue(true)
    component.deleteQuestion({id: 1} as Question)
    expect(component.questions.length).toBe(1)
  })

  it('should detect file input change', inject([ApiProfessorService], (apiServiceStub: ApiProfessorServiceStub) => { 

    const dataTransfer = new DataTransfer()

    dataTransfer.items.add(new File([''], 'test-file.csv', {type: "text/csv"}))

    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
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
