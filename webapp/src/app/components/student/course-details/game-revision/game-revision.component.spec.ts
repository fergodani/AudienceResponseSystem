import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRevisionComponent } from './game-revision.component';
import { Router } from '@angular/router';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiStudentServiceStub } from '@app/core/services/stubs/api.student.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

describe('GameRevisionComponent', () => {
  let component: GameRevisionComponent;
  let fixture: ComponentFixture<GameRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [GameRevisionComponent],
      providers: [
        { provide: ApiStudentService, useClass: ApiStudentServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: Router },
        { provide: ApiAuthService, useClass: AuthServiceStub }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch result on initialization', () => {
    expect(component.result).toBeTruthy();
    expect(component.isLoading).toBe(false);
  });

  it("should show the questions with the result retrieved", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("question 1");
    expect(compiled.nativeElement.innerHTML).toContain("question 2");
    expect(compiled.nativeElement.innerHTML).toContain("answer 1 1");
    expect(compiled.nativeElement.innerHTML).toContain("answer 1 2");
    expect(compiled.nativeElement.innerHTML).toContain("answer 2 1");
    expect(compiled.nativeElement.innerHTML).toContain("answer 2 2");
  })

});
