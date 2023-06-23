import { TestBed } from '@angular/core/testing';

import { SocketioService } from './socketio.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocketioServiceStub } from '../services/stubs/socketio.service.mock';

describe('SocketioService', () => {
  let service: SocketioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SocketioService, useClass: SocketioServiceStub},
      ]
    }).compileComponents()
    service = TestBed.inject(SocketioService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
