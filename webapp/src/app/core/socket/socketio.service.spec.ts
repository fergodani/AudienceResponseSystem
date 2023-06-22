import { TestBed } from '@angular/core/testing';

import { SocketioService } from './socketio.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SocketioService', () => {
  let service: SocketioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SocketioService},
      ]
    }).compileComponents()
    service = TestBed.inject(SocketioService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
