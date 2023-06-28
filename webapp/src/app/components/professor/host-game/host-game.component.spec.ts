import { ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';
import { HostGameComponent } from './host-game.component';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSessionState} from '@app/core/models/game.model';
import { SocketioService } from '@app/core/socket/socketio.service';
import { SocketioServiceStub } from '@app/core/services/stubs/socketio.service.mock';

describe('HostGameComponent', () => {
  let component: HostGameComponent;
  let fixture: ComponentFixture<HostGameComponent>;
  let compiled: any

  beforeEach(() => {
    let paramMap = new Map<string, string>()
    paramMap.set("game_id", "1")
    paramMap.set("course_id", "1")
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [HostGameComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        },
        { provide: Router },
        { provide: SocketioService, useClass: SocketioServiceStub},
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(HostGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user list', () => {
    expect(compiled.nativeElement.innerHTML).toContain("testUser1");
    expect(compiled.nativeElement.innerHTML).toContain("testUser2");
  });

  it('should show question preview', () => {
    component.actualQuestion = {
      description: "testQuestion",
      id: 1,
      subject: "subject",
      type: 'multioption',
      answers: [],
      answer_time: 5,
      resource: "",
      user_creator_id: 1
    }
    component.gameSession.state = GameSessionState.is_preview_screen
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("testQuestion");
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

  it('should show question result', () => {
    component.correctAnswers = [{
      description: "testAnswer1",
      is_correct: true
    },]
    component.gameSession.state = GameSessionState.is_question_result
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("testAnswer1");
    expect(compiled.nativeElement.innerHTML).not.toContain("testAnswer2");
    expect(compiled.nativeElement.innerHTML).not.toContain("testAnswer3");
    expect(compiled.nativeElement.innerHTML).not.toContain("testAnswer4");
  });

  it('should show leaderboard screen', () => {
    component.gameSession.users = [
      {
        id: 1,
        username: "testUser1",
        role: 'student'
      },
      {
        id: 2,
        username: "testUser2",
        role: 'student'
      },
      {
        id: 3,
        username: "testUser3",
        role: 'student'
      }
    ]
    component.gameSession.state = GameSessionState.is_leaderboard_screen
    fixture.detectChanges();
    expect(compiled.nativeElement.innerHTML).toContain("testUser1");
    expect(compiled.nativeElement.innerHTML).toContain("testUser2");
    expect(compiled.nativeElement.innerHTML).toContain("testUser3");
  });

  it('leave game should navigate to /professor/home', fakeAsync(inject([Router], (mockRouter: Router) => {
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    component.leaveGame()
    expect(spy.calls.first().args[0]).toContain('/professor/home')
  })));
});
