import { createReducer, on } from '@ngrx/store';
import * as CommonActions from './common.actions';

export interface State {
  loading: boolean;
  snackBarMsg: string;
  mainSidebarIsVisible: boolean;
  apiError: any;
  searchKey: string;
  currentPlanId: string;
  isPreviewMode: boolean;
}

export const initialState: State = {
  loading: false,
  snackBarMsg: '',
  mainSidebarIsVisible: true,
  apiError: null,
  searchKey: '',
  currentPlanId: '',
  isPreviewMode: false,
};

export const reducer = createReducer(
  initialState,
  on(CommonActions.startLoading, (state) => {
    return { ...state, loading: true };
  }),
  on(CommonActions.endLoading, (state) => {
    return { ...state, loading: false };
  }),
  on(CommonActions.setSnackBarMsg, (state, action) => {
    return { ...state, snackBarMsg: action.message };
  }),
  on(CommonActions.toggleMainSidebar, (state) => {
    return {
      ...state,
      mainSidebarIsVisible: state.mainSidebarIsVisible ? false : true,
    };
  }),
  on(CommonActions.showMainSidebar, (state, action) => {
    return { ...state, mainSidebarIsVisible: action.bool };
  }),
  on(CommonActions.setTreeSearchKey, (state, action) => {
    return { ...state, searchKey: action.searchKey };
  }),
  on(CommonActions.setCurrentPlanId, (state, action) => {
    return { ...state, currentPlanId: action.id };
  }),
  on(CommonActions.setPreviewMode, (state, action) => {
    return { ...state, isPreviewMode: action.status };
  })
);
