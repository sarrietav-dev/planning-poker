import * as MatchActions from './match.actions';
import { matchReducer, initialState } from './index';

describe('matchReducer', () => {
  it('should return the initial state', () => {
    const action = {} as any;
    const state = matchReducer(initialState, action);

    expect(state).toBe(initialState);
  });

  it('should set match', () => {
    const match = {
      cardDeck: [],
      id: '1',
      name: 'Test',
      players: [],
      spectators: [],
    };
    const action = MatchActions.setMatch({ match });
    const state = matchReducer(initialState, action);

    expect(state.match).toEqual(match);
  });

  it('should add player', () => {
    const name = 'Player 1';
    const id = '1';
    const action = MatchActions.playerJoined({ name, id, card: 5 });
    const state = matchReducer(initialState, action);

    expect(state.match.players).toEqual([{ name, id, card: 5 }]);
  });

  it('should remove player', () => {
    const playerId = '1';
    const action = MatchActions.playerLeft({ playerId });
    const state = matchReducer(
      {
        ...initialState,
        match: {
          ...initialState.match,
          players: [{ name: 'Player 1', id: playerId, card: 5 }],
        },
      },
      action,
    );

    expect(state.match.players).toEqual([]);
  });

  it('should add spectator', () => {
    const name = 'Spectator 1';
    const id = '1';
    const action = MatchActions.spectatorJoined({ name, id });
    const state = matchReducer(initialState, action);

    expect(state.match.spectators).toEqual([{ name, id }]);
  });

  it('should remove spectator', () => {
    const spectatorId = '1';
    const action = MatchActions.spectatorLeft({ spectatorId });
    const state = matchReducer(
      {
        ...initialState,
        match: {
          ...initialState.match,
          spectators: [{ name: 'Spectator 1', id: spectatorId }],
        },
      },
      action,
    );

    expect(state.match.spectators).toEqual([]);
  });

  it('should toggle isAdmin', () => {
    const isAdmin = true;
    const action = MatchActions.toggleIsAdmin({ isAdmin });
    const state = matchReducer(initialState, action);

    expect(state.isAdmin).toEqual(isAdmin);
  });

  it('should reset game', () => {
    const action = MatchActions.resetGame();
    const state = matchReducer(
      {
        ...initialState,
        match: {
          ...initialState.match,
          players: [{ name: 'Player 1', id: '1', card: 5 }],
        },
        areCardsRevealed: true,
      },
      action,
    );

    expect(state.match.players[0].card).toBe(-1);
    expect(state.areCardsRevealed).toEqual(false);
  });

  it('should set player card', () => {
    const playerId = '1';
    const card = 5;
    const action = MatchActions.setPlayerCard({ playerId, card });
    const state = matchReducer(
      {
        ...initialState,
        match: {
          ...initialState.match,
          players: [{ name: 'Player 1', id: playerId, card: null }],
        },
      },
      action,
    );

    expect(state.match.players[0].card).toEqual(card);
  });

  it('should reveal cards', () => {
    const action = MatchActions.revealCards();
    const state = matchReducer(initialState, action);

    expect(state.areCardsRevealed).toEqual(true);
  });

  it('should change cards', () => {
    const cards = [1, 2, 3];
    const action = MatchActions.changeCards({ cards });
    const state = matchReducer(initialState, action);

    expect(state.match.cardDeck).toEqual(cards);
  });
});
