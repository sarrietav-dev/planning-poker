import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private http: HttpClient) {}

  createMatch(name: string) {}

  join(name: string, mode: 'player' | 'spectator') {}
}
