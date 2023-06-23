import { TestBed } from '@angular/core/testing';

import { ApiStudentService } from './api.user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApiUserService', () => {
  let service: ApiStudentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiStudentService, ApiStudentService},
      ]
    }).compileComponents()
    service = TestBed.inject(ApiStudentService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
