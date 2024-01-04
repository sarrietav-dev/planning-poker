import { createReducer, createSelector, on } from '@ngrx/store';
import { Match } from '@planning-poker/models';
import * as MatchActions from './match.actions';
import { produce } from 'immer';

export interface State {
  match: Match;
  isAdmin: boolean;
  areCardsRevealed?: boolean;
}

export const initialState: State = {
  match: {
    cardDeck: [],
    id: '',
    name: '',
    players: [],
    spectators: [],
  },
  isAdmin: false,
  areCardsRevealed: false,
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
  on(MatchActions.spectatorJoined, (state, { name, id }) =>
    produce(state, (draft) => {
      draft.match.spectators.push({ name, id });
    })
  ),
  on(MatchActions.spectatorLeft, (state, { spectatorId }) =>
    produce(state, (draft) => {
      draft.match.spectators = draft.match.spectators.filter(
        (s) => s.id !== spectatorId
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
  ),
  on(MatchActions.changeCards, (state, { cards }) =>
    produce(state, (draft) => {
      draft.match.cardDeck = cards;
    })
  )
)

export const selectMatch = (state: { match: State }) => state.match;

export const selectMatchPlayers = createSelector(
  selectMatch,
  (match) => match.match.players
);

export const selectMatchSpectators = createSelector(
  selectMatch,
  (match) => match.match.spectators
);

export const selectIsAdmin = createSelector(
  selectMatch,
  (match) => match.isAdmin
);

export const selectPlayers = createSelector(
  selectMatchPlayers,
  (players) => players
);
