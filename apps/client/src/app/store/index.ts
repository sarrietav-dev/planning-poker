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
  on(MatchActions.setMatch, (state, { match }) => match)
);

export const selectPlayers = (state: { match: Match }) => state.match.players;


