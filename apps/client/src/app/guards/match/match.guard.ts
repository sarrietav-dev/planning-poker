import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, from } from 'rxjs';
import { MatchService } from 'src/app/services/match/match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchGuard implements CanActivate {
  constructor(private router: Router, private service: MatchService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(
      new Promise<boolean>(async (resolve) => {
        const matchId = route.paramMap.get('id');

        if (!matchId) {
          await this.router.navigate(['/']);
          return resolve(false);
        }

        const exists = await this.service.doesMatchExist(matchId);

        if (!exists) {
          await this.router.navigate(['/']);
          return resolve(false);
        }

        return resolve(true);
      })
    );
  }
}
