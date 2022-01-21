import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as pageActions from './page.actions';

const entityInfo: EntityInfo = {
  name: 'page',
  actions: pageActions
}


@Injectable()
export class PageEffects {



  constructor(private createEffectSv: CreateEffectService) {}

  addPage$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  loadPages$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  updatePage$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
  deletePage$: Observable<Action> = this.createEffectSv.deleteEntity(entityInfo);
  deletePages$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);

}
