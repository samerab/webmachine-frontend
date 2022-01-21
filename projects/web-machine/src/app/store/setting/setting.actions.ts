import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Setting } from './setting.model';

export const loadSettings = createAction(
  '[Setting] Load Settings'
);

export const loadSettingsSuccess = createAction(
  '[Setting] Load Settings Success',
  props<{ settings: Setting[] }>()
);

export const loadSettingsFailure = createAction(
  '[Setting] Load Settings Failure'
);

export const updateSetting = createAction(
  '[Setting] Update Setting',
  props<{ setting: Update<Setting> }>()
);

export const updateSettingSuccess = createAction(
  '[Setting] Update Setting Success',
  props<{ setting: Update<Setting> }>()
);

export const updateSettingFailure = createAction(
  '[Setting] Update Setting Failure'
);

// Unused yet
export const addSetting = createAction(
  '[Setting/API] Add Setting',
  props<{ setting: Setting }>()
);

export const upsertSetting = createAction(
  '[Setting/API] Upsert Setting',
  props<{ setting: Setting }>()
);

export const addSettings = createAction(
  '[Setting/API] Add Settings',
  props<{ settings: Setting[] }>()
);

export const upsertSettings = createAction(
  '[Setting] Upsert Settings',
  props<{ settings: Setting[] }>()
);

export const upsertSettingsSuccess = createAction(
  '[Setting] Upsert Settings Success',
  props<{ settings: Setting[] }>()
);

export const updateSettings = createAction(
  '[Setting/API] Update Settings',
  props<{ settings: Update<Setting>[] }>()
);

export const deleteSetting = createAction(
  '[Setting/API] Delete Setting',
  props<{ id: string }>()
);

export const deleteSettings = createAction(
  '[Setting/API] Delete Settings',
  props<{ ids: string[] }>()
);

export const clearSettings = createAction(
  '[Setting] Clear Settings'
);

export const clearSettingsSuccess = createAction(
  '[Setting] Clear Settings Success'
);
