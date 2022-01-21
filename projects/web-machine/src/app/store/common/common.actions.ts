import { createAction, props } from '@ngrx/store';
import { MessageOptions } from '@ws-sal';

export const failure = createAction(
  '[Common] Failure',
  props<{err: any}>()
);

export const showMsg = createAction(
  '[Common] ShowMsg',
  props<{options: MessageOptions}>()
);

export const startLoading = createAction(
  '[Common] Start Loading'
);

export const endLoading = createAction(
  '[Common] End Loading'
);

export const setSnackBarMsg = createAction(
  '[Common] Set Snack Bar Msg',
  props<{ message: string }>()
);

export const toggleMainSidebar = createAction(
  '[Common] Toggle Main Sidebar',
);

export const showMainSidebar = createAction(
  '[Common] Show Main Sidebar',
  props<{ bool: boolean }>()
);

export const setTreeSearchKey = createAction(
  '[Common] Set Tree SearchKey',
  props<{ searchKey: string }>()
);

export const setCurrentPlanId = createAction(
  '[Common] Set Current Plan Id',
  props<{ id: string }>()
);
