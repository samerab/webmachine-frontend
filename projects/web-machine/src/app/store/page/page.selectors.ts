import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll, selectIds } from './page.reducer';

export const state = createFeatureSelector<State>('page');
export const entities = createSelector(state, selectEntities);

export const allPages = createSelector(state, selectAll);
export const allPagesIds = createSelector(state, selectIds);
export const getPageById = (id: string) =>
  createSelector(entities, (entities) => entities[id]);
export const getAllPagesSlugs = () =>
  createSelector(allPages, (allPages) =>
    allPages.map((page) => page.info.slug)
  );

export const currentPage = createSelector(
  state,
  (state: State) => state.currentPage
);
export const homepageId = createSelector(allPagesIds, (allPagesIds) => {
  return (allPagesIds as string[]).find((id) => id.startsWith('homepage-'));
});
//export const gridIdToDelete = createSelector(state,(state: State) => state.gridIdToDelete);
//export const blockIdToDelete = createSelector(state,(state: State) => state.blockIdToDelete);

//export const sectionListToAdd = createSelector(state,(state: State) => state.sectionListToAdd);
//export const blockToAdd = createSelector(state,(state: State) => state.blockToAdd);
//export const isAddGrid = createSelector(state,(state: State) => state.isAddGrid);
//export const gridToUpdate = createSelector(state,(state: State) => state.gridToUpdate);
//export const isPreviewMode = createSelector(state,(state: State) => state.isPreviewMode);
