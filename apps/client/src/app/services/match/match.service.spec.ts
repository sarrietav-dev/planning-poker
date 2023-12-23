import { TestBed } from '@angular/core/testing';

import { MatchService } from './match.service';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import {
  playerJoined,
  resetGame,
  revealCards,
  setMatch,
  toggleIsAdmin,
} from 'src/app/store/match.actions';
import * as events from '@planning-poker/events';
import { Router } from '@angular/router';

describe('MatchService', () => {
  let service: MatchService;
  let store: jasmine.SpyObj<Store>;
  let socket: jasmine.SpyObj<Socket>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const socketSpy = jasmine.createSpyObj('Socket', [
      'emit',
      'fromEvent',
    ]) as jasmine.SpyObj<Socket>;

    socketSpy.fromEvent.and.returnValue(EMPTY);

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeSpy.dispatch.and.callThrough();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Socket, useValue: socketSpy },
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(MatchService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    socket = TestBed.inject(Socket) as jasmine.SpyObj<Socket>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('@playerJoined$', () => {
    it('should dispatch playerJoined', (done) => {
      socket.fromEvent.and.returnValue(of({ id: '1', name: 'Player 1' }));
      store.dispatch.and.callThrough();
      service.playerJoined$().subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          playerJoined({ id: '1', name: 'Player 1' })
        );
        done();
      });
    });
  });

  describe('@createMatch', () => {
    it('should emit createMatch', () => {
      service.createMatch('hi');
      expect(socket.emit).toHaveBeenCalledWith(
        events.CreateMatchCommand,
        'hi',
        jasmine.any(Function)
      );
    });

    it('should dispatch toggleIsAdmin if match exists', () => {
      socket.emit.and.callFake((_event, _data, cb) => {
        cb({ matchId: '1' });
      });

      service.createMatch('hi');

      expect(store.dispatch).toHaveBeenCalledWith(
        toggleIsAdmin({ isAdmin: true })
      );
    });

    it('should navigate to match after creation', () => {
      socket.emit.and.callFake((_event, _data, cb) => {
        cb({ matchId: '1' });
      });

      service.createMatch('hi');

      expect(router.navigate).toHaveBeenCalledWith(['/match', '1']);
    });
  });

  describe('@joinMatch', () => {
    it('should emit joinMatch', () => {
      service.joinMatch('2', 'hi', '2');
      expect(socket.emit).toHaveBeenCalledWith(
        events.JoinMatchCommand,
        {
          matchId: '2',
          name: 'hi',
          mode: '2',
        },
        jasmine.any(Function)
      );
    });

    it('should dispatch setMatch if match exists', () => {
      const match = {
        cardDeck: [],
        id: 'match',
        name: 'hi',
        players: [],
        spectators: [],
      };

      socket.emit.and.callFake((event, data, cb) => {
        cb(match);
      });

      service.joinMatch('2', 'hi', '2');

      expect(store.dispatch).toHaveBeenCalledWith(setMatch({ match }));
    });

    it('should alert if match does not exist', () => {
      socket.emit.and.callFake((_event, _data, cb) => {
        cb(null, { message: 'error' });
      });

      spyOn(window, 'alert');

      service.joinMatch('2', 'hi', '2');

      expect(window.alert).toHaveBeenCalledWith('error');
    });
  });

  describe('@selectCard', () => {
    it('should emit selectCard', () => {
      service.selectCard(2);
      expect(socket.emit).toHaveBeenCalledWith(events.ChooseCardCommand, 2);
    });
  });

  describe('@doesMatchExist', () => {
    it('should return true if match exists', () => {
      socket.emit.and.callFake((_event, _data, cb) => {
        cb(true);
      });
      service.doesMatchExist('2').then((result) => {
        expect(result).toBeTrue();
      });
    });

    it('should return false if match does not exist', () => {
      socket.emit.and.callFake((_event, _data, cb) => {
        cb(false);
      });

      service.doesMatchExist('2').then((result) => {
        expect(result).toBeFalse();
      });
    });
  });

  describe('@resetGame', () => {
    it('should dispatch resetGame', () => {
      service.resetGame();
      expect(store.dispatch).toHaveBeenCalledWith(resetGame());
    });
  });

  describe('@revealCards', () => {
    it('should emit revealCards', () => {
      service.revealCards();
      expect(store.dispatch).toHaveBeenCalledWith(revealCards());
    });
  });
});
