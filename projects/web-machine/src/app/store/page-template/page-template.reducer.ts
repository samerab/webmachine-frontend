import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PageTemplate } from './page-template.model';
import * as PageTemplateActions from './page-template.actions';

export const pageTemplatesFeatureKey = 'pageTemplates';

export interface State extends EntityState<PageTemplate> {
  // additional entities state properties
}

export const adapter: EntityAdapter<PageTemplate> = createEntityAdapter<PageTemplate>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(PageTemplateActions.addPageTemplateSuccess,
    (state, action) => adapter.addOne(action.pageTemplate, state)
  ),
  on(PageTemplateActions.upsertPageTemplate,
    (state, action) => adapter.upsertOne(action.pageTemplate, state)
  ),
  on(PageTemplateActions.addPageTemplates,
    (state, action) => adapter.addMany(action.pageTemplates, state)
  ),
  on(PageTemplateActions.upsertPageTemplates,
    (state, action) => adapter.upsertMany(action.pageTemplates, state)
  ),
  on(PageTemplateActions.updatePageTemplateSuccess,
    (state, action) => adapter.updateOne(action.pageTemplate, state)
  ),
  on(PageTemplateActions.updatePageTemplates,
    (state, action) => adapter.updateMany(action.pageTemplates, state)
  ),
  on(PageTemplateActions.deletePageTemplateSuccess,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(PageTemplateActions.deletePageTemplates,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(PageTemplateActions.loadPageTemplatesSuccess,
    (state, action) => adapter.setAll(action.pageTemplates, state)
  ),
  on(PageTemplateActions.clearPageTemplates,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
