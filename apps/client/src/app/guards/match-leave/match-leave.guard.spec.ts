import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { matchLeaveGuard } from './match-leave.guard';

describe('matchLeaveGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => matchLeaveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
