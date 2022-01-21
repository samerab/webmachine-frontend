import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Setting } from './setting.model';
import * as SettingActions from './setting.actions';

export const settingsFeatureKey = 'settings';

export interface State extends EntityState<Setting> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Setting> = createEntityAdapter<Setting>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(SettingActions.loadSettingsSuccess,
    (state, action) => adapter.setAll(action.settings, state)
  ),
  on(SettingActions.updateSettingSuccess,
    (state, action) => adapter.updateOne(action.setting, state)
  ),
  on(SettingActions.addSetting,
    (state, action) => adapter.addOne(action.setting, state)
  ),
  on(SettingActions.upsertSetting,
    (state, action) => adapter.upsertOne(action.setting, state)
  ),
  on(SettingActions.addSettings,
    (state, action) => adapter.addMany(action.settings, state)
  ),
  on(SettingActions.upsertSettingsSuccess,
    (state, action) => adapter.upsertMany(action.settings, state)
  ),
  on(SettingActions.updateSettings,
    (state, action) => adapter.updateMany(action.settings, state)
  ),
  on(SettingActions.deleteSetting,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(SettingActions.deleteSettings,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(SettingActions.clearSettingsSuccess,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
