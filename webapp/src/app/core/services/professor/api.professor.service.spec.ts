import { TestBed } from '@angular/core/testing';

import { ApiProfessorService } from './api.professor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiProfessorServiceStub } from '../stubs/api.professor.service.mock';

describe('ApiProfessorService', () => {
  let service: ApiProfessorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiProfessorService, useClass: ApiProfessorServiceStub},
      ]
    }).compileComponents()
    service = TestBed.inject(ApiProfessorService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
