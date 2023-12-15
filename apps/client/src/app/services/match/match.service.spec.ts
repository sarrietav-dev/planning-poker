import { TestBed } from '@angular/core/testing';

import { MatchService } from './match.service';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('Socket', [
      'emit',
      'fromEvent',
    ]) as jasmine.SpyObj<Socket>;

    socketSpy.fromEvent.and.callFake((event) => {
      return EMPTY;
    });

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Socket, useValue: socketSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });
    service = TestBed.inject(MatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
