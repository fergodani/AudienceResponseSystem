import { TestBed, fakeAsync, inject } from '@angular/core/testing';

import { ApiAuthService } from './api.auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '@app/core/models/user.model';
import { Router } from '@angular/router';

describe('ApiAuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let service: ApiAuthService;

  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpyObj},
        { provide: Router },
      ]
    }).compileComponents()
    service = TestBed.inject(ApiAuthService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    let user: User = {
      id: 1,
      username: "testUser",
      role: "student"
    }
    it('should return user if login was successfull', () => {
      httpClientSpy.post.and.returnValue(of(user))
      service.login(user).subscribe({
        next: (userRetrieved) => {
          expect(userRetrieved).toEqual(user)
        }
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('logout()', () => {
    it('should navigate to /login', fakeAsync(inject([Router], (mockRouter: Router) => {
      const spy = spyOn(mockRouter, 'navigate').and.stub();
      service.logout()
      expect(spy.calls.first().args[0]).toContain('/login')
    })));
  })
});

