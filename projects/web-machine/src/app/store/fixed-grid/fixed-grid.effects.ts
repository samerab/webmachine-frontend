import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as fixedGridActions from './fixed-grid.actions';

const entityInfo: EntityInfo = {
  name: 'fixedGrid',
  actions: fixedGridActions
}

@Injectable()
export class FixedGridEffects {



  constructor(private createEffectSv: CreateEffectService) {}

  addFixedGrid$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  loadFixedGrids$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  updateFixedGrid$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
  updateFixedGrids$: Observable<Action> = this.createEffectSv.updateManyEntity(entityInfo);
  deleteFixedGrid$: Observable<Action> = this.createEffectSv.deleteEntity(entityInfo);
  deleteFixedGrids$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);

}
