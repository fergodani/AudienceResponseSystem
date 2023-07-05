import { ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';

import { StudentGameComponent } from './student-game.component';
import { SocketioService } from '@app/core/services/socket/socketio.service';
import { SocketioServiceStub } from '@app/core/services/stubs/socketio.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { GameSessionState } from '@app/core/models/game.model';

describe('StudentGameComponent', () => {
  let component: StudentGameComponent;
  let fixture: ComponentFixture<StudentGameComponent>;
  let compiled: any

  beforeEach(() => {
    let paramMap = new Map<string, string>()
    paramMap.set("id", "1")
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [StudentGameComponent],
      providers: [
        { provide: SocketioService, useClass: SocketioServiceStub },
        { provide: ApiAuthService, useClass: AuthServiceStub },
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        },
        { provide: Router },
        { provide: SocketioService, useClass: SocketioServiceStub},
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(StudentGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show wait room', () => {
    expect(compiled.nativeElement.innerHTML).toContain("STUDENT.GAME.LOOK_AT_YOUR_NAME");
  });

  it('should show preview', () => {
    component.timeLeft = 5
    component.gameSession.state = GameSessionState.is_preview_screen
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain(5);
  });

  it('should show question screen', () => {
    component.actualQuestion = {
      description: "testQuestion",
      id: 1,
      subject: "subject",
      type: 'multioption',
      answers: [
        {
          description: "testAnswer1",
          is_correct: true
        },
        {
          description: "testAnswer2",
          is_correct: false
        },
        {
          description: "testAnswer3",
          is_correct: false
        },
        {description: "testAnswer4",
        is_correct: false

        }
      ],
      answer_time: 5,
      resource: "",
      user_creator_id: 1
    }
    component.gameSession.state = GameSessionState.is_question_screen
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("testQuestion");
    expect(compiled.nativeElement.innerHTML).toContain("testAnswer1");
    expect(compiled.nativeElement.innerHTML).toContain("testAnswer2");
    expect(compiled.nativeElement.innerHTML).toContain("testAnswer3");
    expect(compiled.nativeElement.innerHTML).toContain("testAnswer4");
  });

  it('should show correct if answer is correct', () => {
    component.actualAnswer = {
      description: "answer1",
      is_correct: true
    }
    component.haveAnswered = true
    component.gameSession.state = GameSessionState.is_question_result
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("STUDENT.GAME.CORRECT");
  });

  it('should show incorrect if answer is incorrect', () => {
    component.actualAnswer = {
      description: "answer1",
      is_correct: false
    }
    component.haveAnswered = true
    component.gameSession.state = GameSessionState.is_question_result
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("STUDENT.GAME.INCORRECT");
  });

  it('should show incorrect if user does not have answered', () => {
    component.actualAnswer = {
      description: "answer1",
      is_correct: false
    }
    component.haveAnswered = true
    component.haveAnswered = false
    component.gameSession.state = GameSessionState.is_question_result
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("STUDENT.GAME.INCORRECT");
  });

  it('should show score', () => {
    component.result.score = 1000
    component.gameSession.state = GameSessionState.is_leaderboard_screen
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain(1000);
  });

});
