import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FixedGrid } from './fixed-grid.model';
import * as FixedGridActions from './fixed-grid.actions';

export const fixedGridsFeatureKey = 'fixedGrids';

export interface State extends EntityState<FixedGrid> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FixedGrid> = createEntityAdapter<FixedGrid>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(FixedGridActions.addFixedGridSuccess,
    (state, action) => adapter.addOne(action.fixedGrid, state)
  ),
  on(FixedGridActions.upsertFixedGrid,
    (state, action) => adapter.upsertOne(action.fixedGrid, state)
  ),
  on(FixedGridActions.addFixedGrids,
    (state, action) => adapter.addMany(action.fixedGrids, state)
  ),
  on(FixedGridActions.upsertFixedGrids,
    (state, action) => adapter.upsertMany(action.fixedGrids, state)
  ),
  on(FixedGridActions.updateFixedGridSuccess,
    (state, action) => adapter.updateOne(action.fixedGrid, state)
  ),
  on(FixedGridActions.updateFixedGridsSuccess,
    (state, action) => adapter.updateMany(action.fixedGrids, state)
  ),
  on(FixedGridActions.deleteFixedGridSuccess,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FixedGridActions.deleteFixedGrids,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FixedGridActions.loadFixedGridsSuccess,
    (state, action) => adapter.setAll(action.fixedGrids, state)
  ),
  on(FixedGridActions.clearFixedGrids,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
