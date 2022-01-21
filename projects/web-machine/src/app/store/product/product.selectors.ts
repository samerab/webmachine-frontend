import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './product.reducer';

export const state = createFeatureSelector<State>('product');
export const entities = createSelector(state, selectEntities);

export const allProducts = createSelector(state, selectAll);
export const allProductsIds = createSelector(state, selectIds);
export const getProductById = (id: string) => createSelector(entities, (entities) => entities[id]);