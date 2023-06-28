import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsComponent } from './game-details.component';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ActivatedRoute } from '@angular/router';

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;
  
  beforeEach(() => {
    let paramMap = new Map<number, string>()
    paramMap.set(1, "1")
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [GameDetailsComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub },
        { provide: ApiAuthService, useClass: AuthServiceStub},
        { provide: ApiService, useClass: AuthServiceStub},
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(GameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user results', () => {
    expect(component.results.length).toBe(2)
  })

  it('should show user results', () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("testUser1");
    expect(compiled.nativeElement.innerHTML).toContain("testUser2");
    expect(compiled.nativeElement.innerHTML).toContain(1000);
    expect(compiled.nativeElement.innerHTML).toContain(2000);
    expect(compiled.nativeElement.innerHTML).toContain(3);
    expect(compiled.nativeElement.innerHTML).toContain(0);
    expect(compiled.nativeElement.innerHTML).toContain(4);
  })
});
