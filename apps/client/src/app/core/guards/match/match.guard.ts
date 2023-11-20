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
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const matchId = route.paramMap.get('id');

    if (!matchId) {
      return this.router.navigate(['/']);
    }

    return true;
  }
}
