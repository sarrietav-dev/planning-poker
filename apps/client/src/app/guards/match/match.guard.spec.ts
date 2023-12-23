import {TestBed} from '@angular/core/testing';

import {MatchGuard} from './match.guard';
import {Socket} from 'ngx-socket-io';
import {Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {MatchService} from 'src/app/services/match/match.service';

describe('MatchGuard', () => {
  let guard: MatchGuard;
  let socketService: jasmine.SpyObj<Socket>;
  let routerService: jasmine.SpyObj<Router>;
  let service: jasmine.SpyObj<MatchService>;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('Socket', [
      'emit',
    ]) as jasmine.SpyObj<Socket>;

    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
    ]) as jasmine.SpyObj<Router>;

    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'doesMatchExist',
    ]) as jasmine.SpyObj<MatchService>;

    TestBed.configureTestingModule({
      providers: [
        {provide: Socket, useValue: socketSpy},
        {provide: Router, useValue: routerSpy},
        {provide: MatchService, useValue: serviceSpy},
      ],
    });
    guard = TestBed.inject(MatchGuard);
    routerService = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    socketService = TestBed.inject(Socket) as jasmine.SpyObj<Socket>;
    service = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to root and return false if matchId is not defined', (done) => {
    const route = {
      paramMap: {get: jasmine.createSpy().and.returnValue(null)},
    } as any;
    const state = {} as RouterStateSnapshot;
    const result = guard.canActivate(route, state) as Observable<boolean>;

    expect(routerService.navigate).toHaveBeenCalledWith(['/']);

    result.subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should navigate to root and return false if match does not exist', (done) => {
    const route = {
      paramMap: {get: jasmine.createSpy().and.returnValue('123')},
    } as any;

    service.doesMatchExist.and.returnValue(Promise.resolve(false));

    const state = {} as RouterStateSnapshot;
    const result = guard.canActivate(route, state) as Observable<boolean>;


    result.subscribe((value) => {
      expect(routerService.navigate).toHaveBeenCalled();
      expect(value).toBe(false);
      done();
    });
  });

  it('should return true if match exists', (done) => {
    const route = {
      paramMap: {get: jasmine.createSpy().and.returnValue('123')},
    } as any;
    const state = {} as RouterStateSnapshot;
    service.doesMatchExist.and.returnValue(Promise.resolve(true));
    const result = guard.canActivate(route, state) as Observable<boolean>;
    expect(routerService.navigate).not.toHaveBeenCalled();
    result.subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });
});
