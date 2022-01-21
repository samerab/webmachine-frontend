import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as gridTemplateActions from './grid-template.actions';

const entityInfo: EntityInfo = {
  name: 'gridTemplate',
  actions: gridTemplateActions
}

@Injectable()
export class GridTemplateEffects {



  constructor(private createEffectSv: CreateEffectService) {}

  addGridTemplate$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  updateGridTemplate$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
  loadGridTemplates$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  deleteGridTemplate$: Observable<Action> = this.createEffectSv.deleteEntity(entityInfo);
  deleteGridTemplates$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);

}
