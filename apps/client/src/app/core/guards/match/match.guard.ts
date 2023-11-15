import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MatchService } from '../../services/match/match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchGuard implements CanActivate {
  constructor(private matchService: MatchService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const matchId = route.paramMap.get('id');
    const playerId = route.queryParamMap.get('player_id');

    if (!matchId || !playerId) {
      return this.router.navigate(['/']);
    }

    this.matchService.joinMatch(matchId, playerId);

    return true;
  }
}
