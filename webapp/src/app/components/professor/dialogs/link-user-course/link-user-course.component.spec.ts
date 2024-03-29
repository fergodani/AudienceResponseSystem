import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUserCourseComponent } from './link-user-course.component';
import { imports } from '@app/core/services/stubs/imports';
import { UserListComponent } from '@app/components/admin/user-list/user-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { ApiProfessorServiceStub } from '@app/core/services/stubs/api.professor.service.mock';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';

describe('LinkUserCourseComponent', () => {
  let component: LinkUserCourseComponent;
  let fixture: ComponentFixture<LinkUserCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [LinkUserCourseComponent, UserListComponent],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub},
        { provide: ApiAuthService, useClass: AuthServiceStub},     
        { provide: ApiService, useClass: ApiServiceStub },
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
    fixture = TestBed.createComponent(LinkUserCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create with user list component', () => {
    expect(component).toBeTruthy();
  });
});
