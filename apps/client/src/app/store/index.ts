import { createReducer, createSelector, on } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import * as MatchActions from './match.actions';

export interface State {
  match: Match;
  isAdmin: boolean;
}

const initialState: State = {
  match: {
    cardDeck: [],
    id: '',
    name: '',
    players: [],
    spectators: [],
  },
  isAdmin: false,
};

export const matchReducer = createReducer(
  initialState,
  on(MatchActions.setMatch, (state, { match }) => ({
    ...state,
    match,
  })),
  on(MatchActions.playerJoined, (state, { name, id }) => ({
    ...state,
    match: {
      ...state.match,
      players: [...state.match.players, { name, id }],
    },
  })),
  on(MatchActions.playerLeft, (state, { playerId }) => ({
    ...state,
    match: {
      ...state.match,
      players: state.match.players.filter((p) => p.id !== playerId),
    },
  })),
  on(MatchActions.toggleIsAdmin, (state, { isAdmin }) => ({
    ...state,
    isAdmin,
  }))
);

export const selectPlayers = createSelector(
  (state: { match: State }) => state.match,
  (match) => match.match.players
);

export const selectIsAdmin = (state: { match: State }) => state.match.isAdmin;
