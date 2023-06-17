import { TestBed } from '@angular/core/testing';

import { ApiStudentService } from './api.user.service';

describe('ApiUserService', () => {
  let service: ApiStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
