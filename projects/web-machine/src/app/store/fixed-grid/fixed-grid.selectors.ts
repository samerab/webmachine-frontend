import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './fixed-grid.reducer';

export const state = createFeatureSelector<State>('fixedGrid');
export const entities = createSelector(state, selectEntities);
export const allFixedGrids = createSelector(state, selectAll);
export const allFixedGridsIds = createSelector(state, selectIds);
export const getFixedGridById = (id: string) => createSelector(entities, (entities) => entities[id]);