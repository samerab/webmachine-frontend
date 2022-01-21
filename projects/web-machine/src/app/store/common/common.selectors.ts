import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './common.reducer';

export const state = createFeatureSelector<State>('common');

export const isLoading = createSelector(state, state => state.loading);
export const snackBarMsg = createSelector(state, state => state.snackBarMsg);
export const mainSidebarIsVisible = createSelector(state, state => state.mainSidebarIsVisible);
export const apiError = createSelector(state, state => state.apiError);
export const treeSearchKey = createSelector(state,(state: State) => state.searchKey);
