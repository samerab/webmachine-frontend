import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './grid-template.reducer';

export const state = createFeatureSelector<State>('gridTemplate');
export const entities = createSelector(state, selectEntities);
export const getGridTemplateById = (id: string) => createSelector(entities, (entities) => entities[id]);

export const allGridTemplates = createSelector(state, selectAll);