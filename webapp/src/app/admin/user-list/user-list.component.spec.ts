import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { Router } from '@angular/router';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { By } from '@angular/platform-browser';
import { imports } from '@app/core/services/stubs/imports';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports ,
      declarations: [UserListComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub},
        { provide: Router},
        { provide: ApiAuthService, useClass: AuthServiceStub}
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })
  
  it('should fetch users on initialization', () => {
    expect(component.users.length).toBeGreaterThan(0);
    expect(component.isLoading).toBe(false);
   
  });

  it("should show the users", () => {
    const compiled = fixture.debugElement;
    expect(compiled.nativeElement.innerHTML).toContain("testUser1");
    expect(compiled.nativeElement.innerHTML).toContain("student");
    expect(compiled.nativeElement.innerHTML).toContain("testUser2");
    expect(compiled.nativeElement.innerHTML).toContain("professor");
    expect(compiled.queryAll(By.css(".btn-danger")).length).toBe(2); // botones de eliminar usuario
  })

  it("onCreateUser should navigate to /user/create", inject([Router], async (mockRouter: Router) => {
    const spy = spyOn(mockRouter, 'navigate').and.stub();
    await component.onCreateUser()
    expect(spy.calls.first().args[0]).toContain('/users/create')
  }))

  it("should delete user", () => {
    component.onDeleteUser(2)
    expect(component.users.length).toBe(1)
  })

  it('should detect file input change', inject([ApiService], (apiServiceStub: ApiServiceStub) => { 
    spyOn(apiServiceStub, 'uploadUserFile')
    const dataTransfer = new DataTransfer()

    dataTransfer.items.add(new File([''], 'test-file.csv', {type: "text/csv"}))

    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(component.fileName).toBeTruthy()
    expect(component.fileName).toBe('test-file.csv')
    expect(apiServiceStub.uploadUserFile).toHaveBeenCalled()
    
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
