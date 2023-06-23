import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiServiceStub } from '../stubs/api.admin.service.mock';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub},
      ]
    }).compileComponents()
    service = TestBed.inject(ApiService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
