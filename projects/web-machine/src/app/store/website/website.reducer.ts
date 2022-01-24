import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Website } from './website.model';
import * as WebsiteActions from './website.actions';

export const websitesFeatureKey = 'websites';

export interface State extends EntityState<Website> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Website> = createEntityAdapter<Website>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(WebsiteActions.loadWebsiteSuccess, (state, action) =>
    adapter.setOne(action.website, state)
  ),
  on(WebsiteActions.addWebsiteSuccess, (state, action) =>
    adapter.addOne(action.website, state)
  ),
  on(WebsiteActions.upsertWebsite, (state, action) =>
    adapter.upsertOne(action.website, state)
  ),
  on(WebsiteActions.addWebsites, (state, action) =>
    adapter.addMany(action.websites, state)
  ),
  on(WebsiteActions.upsertWebsites, (state, action) =>
    adapter.upsertMany(action.websites, state)
  ),
  on(WebsiteActions.updateWebsite, (state, action) =>
    adapter.updateOne(action.website, state)
  ),
  on(WebsiteActions.updateWebsites, (state, action) =>
    adapter.updateMany(action.websites, state)
  ),
  on(WebsiteActions.deleteWebsiteSuccess, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(WebsiteActions.deleteWebsites, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(WebsiteActions.loadManyWebsitesSuccess, (state, action) =>
    adapter.setAll(action.websites, state)
  ),
  on(WebsiteActions.loadWebsitesSuccess, (state, action) =>
    adapter.setAll(action.websites, state)
  ),
  on(WebsiteActions.clearWebsites, (state) => adapter.removeAll(state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
