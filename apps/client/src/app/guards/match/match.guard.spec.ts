import { TestBed } from '@angular/core/testing';

import { Router, RouterStateSnapshot } from '@angular/router';
import { MatchService } from 'src/app/services/match/match.service';
import { MatchGuard } from './match.guard';
import { SocketIoClientService } from 'src/app/services/socket.io-client/socket.io-client.service';
import { EMPTY } from 'rxjs';

describe('MatchGuard', () => {
  let guard: typeof MatchGuard;
  let routerService: jasmine.SpyObj<Router>;
  let service: jasmine.SpyObj<MatchService>;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('SocketIoClientService', [
      'emit',
      'fromEvent',
    ]) as jasmine.SpyObj<SocketIoClientService>;

    socketSpy.fromEvent.and.returnValue(EMPTY);

    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
    ]) as jasmine.SpyObj<Router>;

    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'doesMatchExist',
    ]) as jasmine.SpyObj<MatchService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: SocketIoClientService, useValue: socketSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatchService, useValue: serviceSpy },
      ],
    });
    guard = MatchGuard;
    routerService = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    service = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to root and return false if matchId is not defined', async () => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue(null) },
    } as any;
    const state = {} as RouterStateSnapshot;
    const result = await TestBed.runInInjectionContext(
      () => guard(route, state) as Promise<boolean>
    );

    expect(routerService.navigate).toHaveBeenCalledWith(['/']);

    expect(result).toBe(false);
  });

  it('should navigate to root and return false if match does not exist', async () => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue('123') },
    } as any;

    service.doesMatchExist.and.returnValue(Promise.resolve(false));

    const state = {} as RouterStateSnapshot;
    const result = await TestBed.runInInjectionContext(
      () => guard(route, state) as Promise<boolean>
    );

    expect(routerService.navigate).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true if match exists', async () => {
    const route = {
      paramMap: { get: jasmine.createSpy().and.returnValue('123') },
    } as any;
    const state = {} as RouterStateSnapshot;

    service.doesMatchExist.and.returnValue(Promise.resolve(true));

    const result = await TestBed.runInInjectionContext(
      () => guard(route, state) as Promise<boolean>
    );

    expect(routerService.navigate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
