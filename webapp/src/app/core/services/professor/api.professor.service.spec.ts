import { TestBed } from '@angular/core/testing';

import { ApiProfessorService } from './api.professor.service';

describe('ApiProfessorService', () => {
  let service: ApiProfessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiProfessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
