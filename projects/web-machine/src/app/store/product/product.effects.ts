import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as productActions from './product.actions';

const entityInfo: EntityInfo = {
  name: 'product',
  actions: productActions
}




@Injectable()
export class ProductEffects {

  constructor(private createEffectSv: CreateEffectService) {}

  addProduct$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  updateProduct$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
  loadProducts$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  deleteProduct$: Observable<Action> = this.createEffectSv.deleteEntity(entityInfo);
  deleteProducts$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);
}
