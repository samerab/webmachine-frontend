import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PageActions from './page.actions';
import { Page } from '@ws-sal';
//import { Page } from './page.model';

export const pagesFeatureKey = 'pages';

export interface State extends EntityState<Page> {
  currentPage: Page;
}

export const adapter: EntityAdapter<Page> = createEntityAdapter<Page>();

export const initialState: State = adapter.getInitialState({
  currentPage: null,
});


export const reducer = createReducer(
  initialState,
  on(PageActions.setCurrentPage,
    (state, action) => {
      return {...state, currentPage: action.page}
    }
  ),
  on(PageActions.addPageSuccess,
    (state, action) => adapter.addOne(action.page, state)
  ),
  on(PageActions.upsertPage,
    (state, action) => adapter.upsertOne(action.page, state)
  ),
  on(PageActions.addPages,
    (state, action) => adapter.addMany(action.pages, state)
  ),
  on(PageActions.upsertPages,
    (state, action) => adapter.upsertMany(action.pages, state)
  ),
  on(PageActions.updatePageSuccess,
    (state, action) => adapter.updateOne(action.page, state)
  ),
  on(PageActions.updatePages,
    (state, action) => adapter.updateMany(action.pages, state)
  ),
  on(PageActions.deletePageSuccess,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(PageActions.deletePagesSuccess,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(PageActions.loadPagesSuccess,
    (state, action) => adapter.setAll(action.pages, state)
  ),
  on(PageActions.clearPages,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
