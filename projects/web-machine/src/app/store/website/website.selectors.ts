import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll } from './website.reducer';

export const state = createFeatureSelector<State>('website');
export const entities = createSelector(state, selectEntities);

export const getAllwebsites = createSelector(state, selectAll);
export const getwebsite = (id: string) =>
  createSelector(entities, (entities) => entities[id]);
