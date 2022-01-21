import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State, selectEntities, selectAll } from './file.reducer';

export const state = createFeatureSelector<State>('file');
export const entities = createSelector(state, selectEntities);

export const getAllFiles = createSelector(state, selectAll);


//export const selectSetting = (state: AppState) => state.setting;
// export const getEntityById = (id: string) => (state: State) => state.entities[id];
// export const getSettingEntityById = (id: string) => createSelector(settingState, getEntityById(id));
