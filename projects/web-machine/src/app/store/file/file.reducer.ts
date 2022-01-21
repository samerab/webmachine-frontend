import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { File } from './file.model';
import * as FileActions from './file.actions';

export const filesFeatureKey = 'files';

export interface State extends EntityState<File> {
  // additional entities state properties
}

export const adapter: EntityAdapter<File> = createEntityAdapter<File>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(FileActions.addFile,
    (state, action) => adapter.addOne(action.file, state)
  ),
  on(FileActions.upsertFile,
    (state, action) => adapter.upsertOne(action.file, state)
  ),
  on(FileActions.addFilesSuccess,
    (state, action) => {
      console.log('from reducer', action.files)
      return adapter.addMany(action.files, state)
    }
  ),
  on(FileActions.upsertFiles,
    (state, action) => adapter.upsertMany(action.files, state)
  ),
  on(FileActions.updateFile,
    (state, action) => adapter.updateOne(action.file, state)
  ),
  on(FileActions.updateFiles,
    (state, action) => adapter.updateMany(action.files, state)
  ),
  on(FileActions.deleteFile,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FileActions.deleteFiles,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FileActions.loadFilesSuccess,
    (state, action) => adapter.setAll(action.files, state)
  ),
  on(FileActions.clearFiles,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
