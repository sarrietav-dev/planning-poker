import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { MatchService } from '../../services/match/match.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class JoinMatchInterceptor implements HttpInterceptor {
  constructor(
    private matchService: MatchService,
    private currentRoute: ActivatedRoute,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const matchId = this.currentRoute.snapshot.paramMap.get('id');
    const playerId = this.currentRoute.snapshot.queryParamMap.get('playerId');

    if (!matchId || !playerId) {
      this.router.navigate(['/']).then(() => next.handle(request));
      return EMPTY;
    }

    this.matchService.joinMatch(matchId, playerId);

    return next.handle(request);
  }
}
