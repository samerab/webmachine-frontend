import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateEffectService, EntityInfo } from '../../core/services/create-effect.service';
import * as pageTemplateActions from './page-template.actions';

const entityInfo: EntityInfo = {
  name: 'pageTemplate',
  actions: pageTemplateActions
}

@Injectable()
export class PageTemplateEffects {
 
  constructor(private createEffectSv: CreateEffectService) {}

  addPageTemplate$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  updatePageTemplate$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
  loadPageTemplates$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  deletePageTemplate$: Observable<Action> = this.createEffectSv.deleteEntity(entityInfo);
  deletePageTemplates$: Observable<Action> = this.createEffectSv.deleteMany(entityInfo);

}
