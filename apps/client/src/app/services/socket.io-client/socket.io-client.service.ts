import { Injectable } from '@angular/core';
import { ClientToServerEvents, ServerToClientEvents } from '@planning-poker/events';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoClientService {
  public readonly socket: Socket<ClientToServerEvents, ServerToClientEvents>

  constructor() {
    const sessionId = sessionStorage.getItem('sessionId');
    this.socket = io(environment.baseUrl, {
      transports: ['websocket'],
      auth: { sessionId }
    });
  }

  fromEvent(event: keyof ClientToServerEvents): Observable<ClientToServerEvents[typeof event]> {
    return new Observable<ClientToServerEvents[typeof event]>(subscriber => {
      const listener = (data: ClientToServerEvents[typeof event]) => {
        subscriber.next(data);
      };

      // I use any here because this.socket.on expects some events that are not in ClientToServerEvents
      // The important thing is that from event has autocomplete and type checking
      const newEvent: any = event;

      this.socket.on(newEvent, listener);
    });
  }

  emit(event: keyof ServerToClientEvents, ...args: Parameters<ServerToClientEvents[typeof event]>): void {
    this.socket.emit(event, ...args);
  }
}
