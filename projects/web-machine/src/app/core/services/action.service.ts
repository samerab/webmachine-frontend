import { CreateEffectService } from './create-effect.service';
import { Injectable } from '@angular/core';

import * as pageTemplageActions from '@ws-store/page-template/page-template.actions';
import * as gridTemplageActions from '@ws-store/grid-template/grid-template.actions';
import * as fixedGridActions from '@ws-store/fixed-grid/fixed-grid.actions';
import * as fileActions from '@ws-store/file/file.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { SalAction, SalActionName } from '@ws-sal';
import { addFiles } from '@ws-store/file/file.actions';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private store: Store<AppState>,private effectSv: CreateEffectService) { }

  dispatchAction(action: SalAction) {
    const entity = action.entity;
    const payload = action.payload;
    const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    const capitalEntityPlural = this.effectSv.getPlural(capitalEntity);
    const actions = this.getActions(entity);
    switch (action.name) {
      case SalActionName.ADD_ONE:
        const add = actions[`add${capitalEntity}`]({ [entity]: payload });
        this.store.dispatch(add)
        break;
      case SalActionName.UPDATE_ONE:
        const update = actions[`update${capitalEntity}`]({ [entity]: payload });
        this.store.dispatch(update)
        break;
      case SalActionName.DELETE_ONE:
        const del = actions[`delete${capitalEntity}`]({ id: payload });
        this.store.dispatch(del)
        break;
      case SalActionName.DELETE_MANY:
        const delMany = actions[`delete${capitalEntityPlural}`]({ ids: payload });
        this.store.dispatch(delMany)
        break;
      case SalActionName.UPLOAD_FILES:
        this.upload(payload)
        break;
    }
  }

  private getActions(entity: any) {
    let actions;
    switch (entity) {
      case 'pageTemplate':
        actions = pageTemplageActions;
        break;
      case 'gridTemplate':
        actions = gridTemplageActions;
        break;
      case 'fixedGrid':
        actions = fixedGridActions;
        break;
      case 'file':
        actions = fileActions;
        break;
      default:
        break;
    }
    return actions
  }

  upload(files) {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }
    this.store.dispatch(addFiles({ files: formData }));
  }



}
