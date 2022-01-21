import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll } from './setting.reducer';

export const state = createFeatureSelector<State>('setting');
export const entities = createSelector(state, selectEntities);

export const getAllSettings = createSelector(state, selectAll);
export const getSetting = (id: string) => createSelector(entities, (entities) => entities[id]);
export const getSettingValue = (id: string) => createSelector(getSetting(id), (setting) => setting?.value);


//export const selectSetting = (state: AppState) => state.setting;
// export const getEntityById = (id: string) => (state: State) => state.entities[id];
// export const getSettingEntityById = (id: string) => createSelector(settingState, getEntityById(id));
