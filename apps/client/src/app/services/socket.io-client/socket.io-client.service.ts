import { Injectable } from '@angular/core';
import { ClientToServerEvents, ServerToClientEvents } from '@planning-poker/events';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoClientService {
  public socket: Socket<ClientToServerEvents, ServerToClientEvents>

  constructor() {
    const sessionId = sessionStorage.getItem('sessionId');
    this.socket = io(environment.baseUrl, {
      transports: ['websocket'],
      auth: { sessionId }
    });
  }


  fromEvent<T extends keyof ClientToServerEvents>(event: T): Observable<Parameters<ClientToServerEvents[T]>[0]> {
    return new Observable<Parameters<ClientToServerEvents[T]>[0]>(subscriber => {
      const listener = (...args: Parameters<ClientToServerEvents[T]>) => {
        subscriber.next(args[0]);
      }
      // I use any here because this.socket.on expects some events that are not in ClientToServerEvents
      // The important thing is that from event has autocomplete and type checking
      const newEvent: any = event;

      this.socket.on(newEvent, listener);
    });
  }

  emit<T extends keyof ServerToClientEvents>(event: T, ...args: Parameters<ServerToClientEvents[T]>): void {
    this.socket.emit(event, ...args);
  }
}
