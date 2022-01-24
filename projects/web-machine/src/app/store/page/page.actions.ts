import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
//import { Page } from '@ws-sal';
import { Page } from './page.model';

export const setCurrentPage = createAction(
  '[Page] Set Current Page',
  props<{ page: Page }>()
);

export const loadPages = createAction('[Page] Load Pages');

export const loadPagesSuccess = createAction(
  '[Page] Load Pages Success',
  props<{ pages: Page[] }>()
);

export const addPage = createAction('[Page] Add Page', props<{ page: Page }>());

export const addPageSuccess = createAction(
  '[Page] Add Page Success',
  props<{ page: Page }>()
);

export const upsertPage = createAction(
  '[Page/API] Upsert Page',
  props<{ page: Page }>()
);

export const addPages = createAction(
  '[Page/API] Add Pages',
  props<{ pages: Page[] }>()
);

export const upsertPages = createAction(
  '[Page/API] Upsert Pages',
  props<{ pages: Page[] }>()
);

export const updatePage = createAction(
  '[Page] Update Page',
  props<{ page: Update<Page> }>()
);

export const updatePageSuccess = createAction(
  '[Page] Update Page Success',
  props<{ page: Update<Page> }>()
);

export const updatePages = createAction(
  '[Page/API] Update Pages',
  props<{ pages: Update<Page>[] }>()
);

export const deletePage = createAction(
  '[Page] Delete Page',
  props<{ id: string }>()
);

export const deletePageSuccess = createAction(
  '[Page] Delete Page Success',
  props<{ id: string }>()
);

export const deletePages = createAction(
  '[Page] Delete Pages',
  props<{ ids: string[] }>()
);

export const deletePagesSuccess = createAction(
  '[Page] Delete Pages Success',
  props<{ ids: string[] }>()
);

export const clearPages = createAction('[Page/API] Clear Pages');
