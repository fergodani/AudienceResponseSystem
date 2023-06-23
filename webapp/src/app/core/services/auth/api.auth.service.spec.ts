import { TestBed } from '@angular/core/testing';

import { ApiAuthService } from './api.auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthServiceStub } from '../stubs/api.auth.service.mock';

describe('ApiLoginService', () => {
  let service: ApiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiAuthService, useClass: AuthServiceStub},
      ]
    }).compileComponents()
    service = TestBed.inject(ApiAuthService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
