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
  on(MatchActions.playerJoined, (state, { name }) => ({
    ...state,
    players: [...state.players, { name }],
  }))
);

export const selectPlayers = (state: { match: Match }) => state.match.players;


