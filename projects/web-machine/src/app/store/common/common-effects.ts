import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as CommonActions from './common.actions';
import { PopupService } from '@ws-sal';

@Injectable()
export class CommonEffects {

  constructor(
    private actions$: Actions,
    private popupSv: PopupService,
  ) { }

  showMsg$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(CommonActions.showMsg),
      tap((action) => this.popupSv.showMsg({...action.options}))
    ),
    {dispatch: false}
  );

  
}