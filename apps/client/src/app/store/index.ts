import { createReducer, createSelector, on } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import * as MatchActions from './match.actions';
import { produce } from 'immer';

export interface State {
  match: Match;
  isAdmin: boolean;
  areCardsRevealed?: boolean;
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
  on(MatchActions.setMatch, (state, { match }) =>
    produce(state, (draft) => {
      draft.match = match;
    })
  ),
  on(MatchActions.playerJoined, (state, { name, id }) =>
    produce(state, (draft) => {
      draft.match.players.push({ name, id });
    })
  ),
  on(MatchActions.playerLeft, (state, { playerId }) =>
    produce(state, (draft) => {
      draft.match.players = draft.match.players.filter(
        (p) => p.id !== playerId
      );
    })
  ),
  on(MatchActions.toggleIsAdmin, (state, { isAdmin }) =>
    produce(state, (draft) => {
      draft.isAdmin = isAdmin;
    })
  ),
  on(MatchActions.resetGame, (state) =>
    produce(state, (draft) => {
      draft.match.players = draft.match.players.map((p) => ({
        ...p,
        card: undefined,
      }));
      draft.areCardsRevealed = false;
    })
  ),
  on(MatchActions.setPlayerCard, (state, { playerId, card }) =>
    produce(state, (draft) => {
      const player = draft.match.players.find((p) => p.id === playerId);
      if (player) {
        player.card = card;
      }
    })
  ),
  on(MatchActions.revealCards, (state) =>
    produce(state, (draft) => {
      draft.areCardsRevealed = true;
    })
  )
);

export const selectPlayers = createSelector(
  (state: { match: State }) => state.match,
  (match) => match.match.players
);

export const selectIsAdmin = (state: { match: State }) => state.match.isAdmin;

export const selectAreCardsRevealed = (state: { match: State }) =>
  state.match.areCardsRevealed;
