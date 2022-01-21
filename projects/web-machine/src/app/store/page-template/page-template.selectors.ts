import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './page-template.reducer';

export const state = createFeatureSelector<State>('pageTemplate');
export const entities = createSelector(state, selectEntities);
export const getPageTemplateById = (id: string) => createSelector(entities, (entities) => entities[id]);

export const allPageTemplates = createSelector(state, selectAll);