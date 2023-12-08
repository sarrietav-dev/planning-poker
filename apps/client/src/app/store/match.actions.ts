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
