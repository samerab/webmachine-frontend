import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GridTemplate } from './grid-template.model';
import * as GridTemplateActions from './grid-template.actions';

export const gridTemplatesFeatureKey = 'gridTemplates';

export interface State extends EntityState<GridTemplate> {
  // additional entities state properties
}

export const adapter: EntityAdapter<GridTemplate> = createEntityAdapter<GridTemplate>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(GridTemplateActions.addGridTemplateSuccess,
    (state, action) => adapter.addOne(action.gridTemplate, state)
  ),
  on(GridTemplateActions.upsertGridTemplate,
    (state, action) => adapter.upsertOne(action.gridTemplate, state)
  ),
  on(GridTemplateActions.addGridTemplates,
    (state, action) => adapter.addMany(action.gridTemplates, state)
  ),
  on(GridTemplateActions.upsertGridTemplates,
    (state, action) => adapter.upsertMany(action.gridTemplates, state)
  ),
  on(GridTemplateActions.updateGridTemplateSuccess,
    (state, action) => adapter.updateOne(action.gridTemplate, state)
  ),
  on(GridTemplateActions.updateGridTemplates,
    (state, action) => adapter.updateMany(action.gridTemplates, state)
  ),
  on(GridTemplateActions.deleteGridTemplateSuccess,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(GridTemplateActions.deleteGridTemplates,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(GridTemplateActions.loadGridTemplatesSuccess,
    (state, action) => adapter.setAll(action.gridTemplates, state)
  ),
  on(GridTemplateActions.clearGridTemplates,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
