import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { PageTemplate } from './page-template.model';

export const loadPageTemplates = createAction(
  '[PageTemplate] Load PageTemplates', 
);

export const loadPageTemplatesSuccess = createAction(
  '[PageTemplate] Load PageTemplates Success', 
  props<{ pageTemplates: PageTemplate[] }>()
);

export const addPageTemplate = createAction(
  '[PageTemplate] Add PageTemplate',
  props<{ pageTemplate: PageTemplate }>()
);

export const addPageTemplateSuccess = createAction(
  '[PageTemplate] Add PageTemplate Success',
  props<{ pageTemplate: PageTemplate }>()
);

export const upsertPageTemplate = createAction(
  '[PageTemplate/API] Upsert PageTemplate',
  props<{ pageTemplate: PageTemplate }>()
);

export const addPageTemplates = createAction(
  '[PageTemplate/API] Add PageTemplates',
  props<{ pageTemplates: PageTemplate[] }>()
);

export const upsertPageTemplates = createAction(
  '[PageTemplate/API] Upsert PageTemplates',
  props<{ pageTemplates: PageTemplate[] }>()
);

export const updatePageTemplate = createAction(
  '[PageTemplate] Update PageTemplate',
  props<{ pageTemplate: Update<PageTemplate> }>()
);

export const updatePageTemplateSuccess = createAction(
  '[PageTemplate] Update PageTemplate Success',
  props<{ pageTemplate: Update<PageTemplate> }>()
);

export const updatePageTemplates = createAction(
  '[PageTemplate/API] Update PageTemplates',
  props<{ pageTemplates: Update<PageTemplate>[] }>()
);

export const deletePageTemplate = createAction(
  '[PageTemplate] Delete PageTemplate',
  props<{ id: string }>()
);

export const deletePageTemplateSuccess = createAction(
  '[PageTemplate] Delete PageTemplate Success',
  props<{ id: string }>()
);

export const deletePageTemplates = createAction(
  '[PageTemplate/API] Delete PageTemplates',
  props<{ ids: string[] }>()
);

export const clearPageTemplates = createAction(
  '[PageTemplate/API] Clear PageTemplates'
);
