import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  State,
  selectEntities,
  selectAll,
  selectTotal,
  selectIds,
} from './website.reducer';

export const state = createFeatureSelector<State>('website');

export const WEBSITES = createSelector(state, selectEntities);
export const websiteIds = createSelector(state, selectIds);
export const allWebsites = createSelector(state, selectAll);
export const WebsitesTotal = createSelector(state, selectTotal);

export const getwebsite = (id: string) =>
  createSelector(WEBSITES, (WEBSITES) => WEBSITES[id]);

export const firstWebsite = createSelector(WEBSITES, (WEBSITES) => {
  const keys = Object.keys(WEBSITES);
  if (keys.length > 0) {
    const firstKey = keys[0];
    const website = WEBSITES[firstKey];
    return website;
  }
  return null;
});
