import { TestBed } from '@angular/core/testing';

import { ApiAuthService } from './api.auth.service';

describe('ApiLoginService', () => {
  let service: ApiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
