import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromPage from './page/page.reducer';
import * as fromProduct from './product/product.reducer';
import * as fromCommon from './common/common.reducer';
import * as fromFile from './file/file.reducer';
import * as fromSetting from './setting/setting.reducer';
import * as fromFixedGrid from './fixed-grid/fixed-grid.reducer';
import * as fromGridTemplate from './grid-template/grid-template.reducer';
import * as fromPageTemplate from './page-template/page-template.reducer';
import * as fromUser from './user/user.reducer';
import * as fromWebsite from './website/website.reducer';

export interface AppState {
  page: fromPage.State;
  product: fromProduct.State;
  common: fromCommon.State;
  file: fromFile.State;
  setting: fromSetting.State;
  fixedGrid: fromFixedGrid.State;
  gridTemplate: fromGridTemplate.State;
  pageTemplate: fromPageTemplate.State;
  user: fromUser.State;
  website: fromWebsite.State;
}

export const reducers: ActionReducerMap<AppState> = {
  page: fromPage.reducer,
  product: fromProduct.reducer,
  common: fromCommon.reducer,
  file: fromFile.reducer,
  setting: fromSetting.reducer,
  fixedGrid: fromFixedGrid.reducer,
  gridTemplate: fromGridTemplate.reducer,
  pageTemplate: fromPageTemplate.reducer,
  user: fromUser.reducer,
  website: fromWebsite.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
