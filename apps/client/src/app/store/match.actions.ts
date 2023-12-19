import { createAction, props } from '@ngrx/store';
import { Match } from '@planning-poker/models';

export const setMatch = createAction(
  '[Match] Set Match',
  props<{ match: Match }>()
);

export const playerJoined = createAction(
  '[Match] Player Joined',
  props<{ name: string; id: string }>()
);

export const playerLeft = createAction(
  '[Match] Player Left',
  props<{ playerId: string }>()
);

export const toggleIsAdmin = createAction(
  '[Match] Toggle Is Admin',
  props<{ isAdmin: boolean }>()
);

export const revealCards = createAction('[Match] Reveal Cards');

export const resetGame = createAction('[Match] Reset Game');

export const setPlayerCard = createAction(
  '[Match] Set Player Card',
  props<{ playerId: string; card: number }>()
);

export const setAdmin = createAction(
  '[Match] Set Admin',
  props<{ playerId: string }>()
);

export const changeCards = createAction(
  '[Match] Change Cards',
  props<{ cards: number[] }>()
);
