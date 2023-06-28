import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { AuthServiceStub } from '@app/core/services/stubs/api.auth.service.mock';
import { imports } from '@app/core/services/stubs/imports';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [HeaderComponent],
      providers: [
        { provide: ApiAuthService, useClass: AuthServiceStub },
        { provide: TranslateService },
      ],
      teardown: { destroyAfterEach: false }
    }).compileComponents()
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show admin links', () => {
    const compiled = fixture.debugElement
    expect(compiled.queryAll(By.css('button')).length).toBe(4)
  })

  it('should show professor links', () => {
    component.user = {
      id: 1,
      username: "professor",
      role: 'professor'
    }
    fixture.detectChanges();
    const compiled = fixture.debugElement
    expect(compiled.queryAll(By.css('button')).length).toBe(3)
  })

  it('should show student links', () => {
    component.user = {
      id: 1,
      username: "student",
      role: 'student'
    }
    fixture.detectChanges();
    const compiled = fixture.debugElement
    expect(compiled.queryAll(By.css('button')).length).toBe(4)
  })

});
