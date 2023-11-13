import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { JoinMatchCommand } from '@pragma-poker/shared/events';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private http: HttpClient, private io: Socket) {}

  createMatch(name: string) {
    return this.http.post<{ id: string; adminId: string }>(
      `${environment.api}/match`,
      { name }
    );
  }

  joinMatch(matchId: string, playerId: string) {
    this.io.emit(JoinMatchCommand, {
      matchId,
      playerId,
    });
  }
}