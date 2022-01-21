import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { File } from './file.model';

export const loadFiles = createAction(
  '[File] Load Files', 
);

export const loadFilesSuccess = createAction(
  '[File] Load Files Success', 
  props<{ files: File[] }>()
);

export const addFiles = createAction(
  '[File] Add Files',
  props<{ files: FormData }>()
);

export const addFilesSuccess = createAction(
  '[File] Add Files Success',
  props<{ files: File[] }>()
);

export const deleteFiles = createAction(
  '[File] Delete Files',
  props<{ ids: string[] }>()
);

export const deleteFilesSuccess = createAction(
  '[File] Delete Files Success',
  props<{ ids: string[] }>()
);

export const addFile = createAction(
  '[File/API] Add File',
  props<{ file: File }>()
);

export const upsertFile = createAction(
  '[File/API] Upsert File',
  props<{ file: File }>()
);

export const upsertFiles = createAction(
  '[File/API] Upsert Files',
  props<{ files: File[] }>()
);

export const updateFile = createAction(
  '[File/API] Update File',
  props<{ file: Update<File> }>()
);

export const updateFiles = createAction(
  '[File/API] Update Files',
  props<{ files: Update<File>[] }>()
);

export const deleteFile = createAction(
  '[File/API] Delete File',
  props<{ id: string }>()
);

export const clearFiles = createAction(
  '[File/API] Clear Files'
);
