import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private http: HttpClient) {}

  createMatch(name: string) {
    return this.http.post<{ id: string; adminId: string }>(
      `${environment.api}/match`,
      { name }
    );
  }
}
