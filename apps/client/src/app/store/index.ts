import { createReducer, on } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import * as MatchActions from './match.actions';

const initialState: Match = {
  cardDeck: [],
  id: '',
  name: '',
  players: [],
  spectators: [],
};

export const matchReducer = createReducer(
  initialState,
  on(MatchActions.setMatch, (state, { match }) => match),
  on(MatchActions.playerJoined, (state, { name, id }) => ({
    ...state,
    players: [...state.players, { name, id }],
  })),
  on(MatchActions.playerLeft, (state, { playerId }) => ({
    ...state,
    players: state.players.filter((player) => player.id !== playerId),
  }))
);

export const selectPlayers = (state: { match: Match }) => state.match.players;
