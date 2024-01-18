import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatchService } from 'src/app/services/match/match.service';

export const matchLeaveGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  const service = inject(MatchService);

  service.clearState();

  return true;
};
