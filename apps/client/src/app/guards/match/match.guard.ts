import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatchService } from 'src/app/services/match/match.service';

export const MatchGuard: CanActivateFn = async (route): Promise<boolean> => {
  const router = inject(Router);
  const service = inject(MatchService);

  const matchId = route.paramMap.get('id');

  if (!matchId) {
    await router.navigate(['/']);
    return false;
  }

  const exists = await service.doesMatchExist(matchId);

  if (!exists) {
    await router.navigate(['/']);
    return false;
  }

  return true;
};
