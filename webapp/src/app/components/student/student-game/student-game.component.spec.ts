import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGameComponent } from './student-game.component';
import { SocketioService } from '@app/core/socket/socketio.service';
import { SocketioServiceStub } from '@app/core/services/stubs/socketio.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ActivatedRoute } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';

describe('StudentGameComponent', () => {
  let component: StudentGameComponent;
  let fixture: ComponentFixture<StudentGameComponent>;

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
        }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(StudentGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
