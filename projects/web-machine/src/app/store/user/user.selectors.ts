import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './user.reducer';

export const state = createFeatureSelector<State>('user');
export const entities = createSelector(state, selectEntities);

export const currentUser = createSelector(state,(state: State) => state.currentUser);