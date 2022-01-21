import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as FileActions from './file.actions';

const entityInfo: EntityInfo = {
  name: 'file',
  actions: FileActions
}


@Injectable()
export class FileEffects {

  constructor(private createEffectSv: CreateEffectService,) {}

  loadFiles$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  uploadFiles$: Observable<Action> = this.createEffectSv.addMany(entityInfo);
  deleteFiles$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);

}
