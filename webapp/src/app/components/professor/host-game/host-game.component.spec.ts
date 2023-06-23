import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGameComponent } from './host-game.component';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';

describe('HostGameComponent', () => {
  let component: HostGameComponent;
  let fixture: ComponentFixture<HostGameComponent>;

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
        }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(HostGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
