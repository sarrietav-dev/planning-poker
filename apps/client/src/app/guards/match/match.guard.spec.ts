import { TestBed } from '@angular/core/testing';

import { MatchGuard } from './match.guard';
import { Socket } from 'ngx-socket-io';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

describe('MatchGuard', () => {
  let guard: MatchGuard;
  let socketService: jasmine.SpyObj<Socket>;
  let routerService: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('Socket', [
      'emit',
    ]) as jasmine.SpyObj<Socket>;

    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
    ]) as jasmine.SpyObj<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Socket, useValue: socketSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(MatchGuard);
    routerService = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    socketService = TestBed.inject(Socket) as jasmine.SpyObj<Socket>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to root and return false if matchId is not defined', (done) => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue(null) },
    } as any;
    const state = {} as RouterStateSnapshot;
    const result = guard.canActivate(route, state);
    expect(routerService.navigate).toHaveBeenCalledWith(['/']);
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    }
  });

  it('should navigate to root and return false if match does not exist', (done) => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue('123') },
    } as any;
    const state = {} as RouterStateSnapshot;
    socketService.emit.and.callFake((event, id, callback) => {
      callback(false);
    });
    const result = guard.canActivate(route, state);
    expect(routerService.navigate).toHaveBeenCalledWith(['/']);
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    }
  });

  it('should return true if match exists', (done) => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue('123') },
    } as any;
    const state = {} as RouterStateSnapshot;
    socketService.emit.and.callFake((event, id, callback) => {
      callback(true);
    });
    const result = guard.canActivate(route, state);
    expect(routerService.navigate).not.toHaveBeenCalled();
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    }
  });
});
