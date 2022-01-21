import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { GridTemplate } from './grid-template.model';

export const loadGridTemplates = createAction(
  '[GridTemplate] Load GridTemplates', 
);

export const loadGridTemplatesSuccess = createAction(
  '[GridTemplate] Load GridTemplates Success', 
  props<{ gridTemplates: GridTemplate[] }>()
);

export const addGridTemplate = createAction(
  '[GridTemplate] Add GridTemplate',
  props<{ gridTemplate: GridTemplate }>()
);

export const addGridTemplateSuccess = createAction(
  '[GridTemplate] Add GridTemplate Success',
  props<{ gridTemplate: GridTemplate }>()
);

export const upsertGridTemplate = createAction(
  '[GridTemplate/API] Upsert GridTemplate',
  props<{ gridTemplate: GridTemplate }>()
);

export const addGridTemplates = createAction(
  '[GridTemplate/API] Add GridTemplates',
  props<{ gridTemplates: GridTemplate[] }>()
);

export const upsertGridTemplates = createAction(
  '[GridTemplate/API] Upsert GridTemplates',
  props<{ gridTemplates: GridTemplate[] }>()
);

export const updateGridTemplate = createAction(
  '[GridTemplate] Update GridTemplate',
  props<{ gridTemplate: Update<GridTemplate> }>()
);

export const updateGridTemplateSuccess = createAction(
  '[GridTemplate] Update GridTemplate Success',
  props<{ gridTemplate: Update<GridTemplate> }>()
);

export const updateGridTemplates = createAction(
  '[GridTemplate/API] Update GridTemplates',
  props<{ gridTemplates: Update<GridTemplate>[] }>()
);

export const deleteGridTemplate = createAction(
  '[GridTemplate] Delete GridTemplate',
  props<{ id: string }>()
);

export const deleteGridTemplateSuccess = createAction(
  '[GridTemplate] Delete GridTemplate Success',
  props<{ id: string }>()
);

export const deleteGridTemplates = createAction(
  '[GridTemplate/API] Delete GridTemplates',
  props<{ ids: string[] }>()
);

export const clearGridTemplates = createAction(
  '[GridTemplate/API] Clear GridTemplates'
);
