import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameDialogComponent } from './create-game-dialog.component';
import { imports } from '@app/core/services/stubs/imports';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { SocketioService } from '@app/core/socket/socketio.service';
import { SocketioServiceStub } from '@app/core/services/stubs/socketio.service.mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('CreateGameDialogComponent', () => {
  let component: CreateGameDialogComponent;
  let fixture: ComponentFixture<CreateGameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CreateGameDialogComponent],
      providers: [
        {provide: ApiAuthService, useClass: AuthServiceStub},
        {provide: SocketioService, useClass: SocketioServiceStub},
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
