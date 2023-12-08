import { createAction, props } from '@ngrx/store';
import { Match } from '@planning-poker/models';

export const setMatch = createAction(
  '[Match] Set Match',
  props<{ match: Match }>()
);

export const playerJoined = createAction(
  '[Match] Player Joined',
  props<{ name: string }>()
);
