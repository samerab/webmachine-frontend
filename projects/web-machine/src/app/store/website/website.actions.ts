import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Website } from './website.model';

export const loadWebsites = createAction(
  '[Website/API] Load Websites',
  props<{ websites: Website[] }>()
);

export const addWebsite = createAction(
  '[Website/API] Add Website',
  props<{ website: Website }>()
);

export const addWebsiteSuccess = createAction(
  '[Website/API] Add Website Success',
  props<{ website: Website }>()
);

export const upsertWebsite = createAction(
  '[Website/API] Upsert Website',
  props<{ website: Website }>()
);

export const addWebsites = createAction(
  '[Website/API] Add Websites',
  props<{ websites: Website[] }>()
);

export const upsertWebsites = createAction(
  '[Website/API] Upsert Websites',
  props<{ websites: Website[] }>()
);

export const updateWebsite = createAction(
  '[Website/API] Update Website',
  props<{ website: Update<Website> }>()
);

export const updateWebsites = createAction(
  '[Website/API] Update Websites',
  props<{ websites: Update<Website>[] }>()
);

export const deleteWebsite = createAction(
  '[Website/API] Delete Website',
  props<{ id: string }>()
);

export const deleteWebsites = createAction(
  '[Website/API] Delete Websites',
  props<{ ids: string[] }>()
);

export const clearWebsites = createAction('[Website/API] Clear Websites');
