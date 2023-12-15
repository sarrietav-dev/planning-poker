import { TestBed } from '@angular/core/testing';

import { MatchService } from './match.service';
import { Socket } from 'ngx-socket-io';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('Socket', [
      'emit',
    ]) as jasmine.SpyObj<Socket>;
    TestBed.configureTestingModule({
      providers: [{ provide: Socket, useValue: socketSpy }],
    });
    service = TestBed.inject(MatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
