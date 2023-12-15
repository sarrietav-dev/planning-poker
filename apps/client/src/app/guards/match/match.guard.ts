import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { DoesMatchExist } from '@planning-poker/events';
import { MatchService } from 'src/app/services/match/match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchGuard implements CanActivate {
  constructor(private router: Router, private service: MatchService) {}

  response: Subject<boolean> = new Subject<boolean>();

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

    this.service.doesMatchExist(matchId, (exists: boolean) => {
      if (!exists) {
        this.router.navigate(['/']);
        this.response.next(false);
      }

      this.response.next(true);
    });

    return this.response.asObservable();
  }
}
