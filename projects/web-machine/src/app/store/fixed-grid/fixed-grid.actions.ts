import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FixedGrid } from './fixed-grid.model';

export const loadFixedGrids = createAction(
  '[FixedGrid] Load FixedGrids', 
);

export const loadFixedGridsSuccess = createAction(
  '[FixedGrid] Load FixedGrids Success', 
  props<{ fixedGrids: FixedGrid[] }>()
);

export const addFixedGrid = createAction(
  '[FixedGrid] Add FixedGrid',
  props<{ fixedGrid: FixedGrid }>()
);

export const addFixedGridSuccess = createAction(
  '[FixedGrid] Add FixedGrid Success',
  props<{ fixedGrid: FixedGrid }>()
);

export const upsertFixedGrid = createAction(
  '[FixedGrid/API] Upsert FixedGrid',
  props<{ fixedGrid: FixedGrid }>()
);

export const addFixedGrids = createAction(
  '[FixedGrid/API] Add FixedGrids',
  props<{ fixedGrids: FixedGrid[] }>()
);

export const upsertFixedGrids = createAction(
  '[FixedGrid/API] Upsert FixedGrids',
  props<{ fixedGrids: FixedGrid[] }>()
);

export const updateFixedGrid = createAction(
  '[FixedGrid] Update FixedGrid',
  props<{ fixedGrid: Update<FixedGrid> }>()
);

export const updateFixedGridSuccess = createAction(
  '[FixedGrid] Update FixedGrid Success',
  props<{ fixedGrid: Update<FixedGrid> }>()
);

export const updateFixedGrids = createAction(
  '[FixedGrid] Update FixedGrids',
  props<{ fixedGrids: Update<FixedGrid>[] }>()
);

export const updateFixedGridsSuccess = createAction(
  '[FixedGrid] Update FixedGrids Success',
  props<{ fixedGrids: Update<FixedGrid>[] }>()
);

export const deleteFixedGrid = createAction(
  '[FixedGrid] Delete FixedGrid',
  props<{ id: string }>()
);

export const deleteFixedGridSuccess = createAction(
  '[FixedGrid] Delete FixedGrid Success',
  props<{ id: string }>()
);

export const deleteFixedGrids = createAction(
  '[FixedGrid/API] Delete FixedGrids',
  props<{ ids: string[] }>()
);

export const clearFixedGrids = createAction(
  '[FixedGrid/API] Clear FixedGrids'
);
