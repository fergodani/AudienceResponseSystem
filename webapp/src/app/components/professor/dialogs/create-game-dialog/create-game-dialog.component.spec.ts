import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CreateGameDialogComponent } from './create-game-dialog.component';
import { imports } from '@app/core/services/stubs/imports';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { SocketioService } from '@app/core/services/socket/socketio.service';
import { SocketioServiceStub } from '@app/core/services/stubs/socketio.service.mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { of } from 'rxjs';

describe('CreateGameDialogComponent', () => {
  let component: CreateGameDialogComponent;
  let fixture: ComponentFixture<CreateGameDialogComponent>;

  const dialogMock = {
    close: () => { }
   };

   const dataMock = {
    course_id: 1
   }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [CreateGameDialogComponent],
      providers: [
        {provide: ApiAuthService, useClass: AuthServiceStub},
        {provide: SocketioService, useClass: SocketioServiceStub},
        {provide: MatDialogRef, useValue: dialogMock},
        { provide: MAT_DIALOG_DATA, useValue: dataMock }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(CreateGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('form invalid when empty', () => {
    expect(component.createGameForm.valid).toBeFalsy();
  });

  it('point type and questions visible fields validity', () => {
    let poinType = component.createGameForm.controls['pointType'];
    let questionsVisible = component.createGameForm.controls['areQuestionsVisible'];
    expect(poinType.valid).toBeFalsy();
    expect(questionsVisible.valid).toBeTruthy();
  });

  it('submitting a form emits correctly', inject([ApiProfessorService, MatDialogRef], (apiServiceStub: ApiProfessorServiceStub) => { 
    spyOn(apiServiceStub, 'createGame').and.returnValue(of({id: 1}))
    expect(component.createGameForm.valid).toBeFalsy();
    component.createGameForm.controls['pointType'].setValue("Estándar");
    expect(component.createGameForm.valid).toBeTruthy();
    component.createGameForm.controls['areQuestionsVisible'].setValue(true);
    expect(component.createGameForm.valid).toBeTruthy();
    
    component.onCreateGame()
    expect(apiServiceStub.createGame).toHaveBeenCalled()
   
  }));
});
