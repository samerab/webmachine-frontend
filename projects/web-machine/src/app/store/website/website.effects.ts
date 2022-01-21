import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CreateEffectService,
  EntityInfo,
} from '../../core/services/create-effect.service';
import * as websiteActions from './website.actions';

const entityInfo: EntityInfo = {
  name: 'website',
  actions: websiteActions,
  detach: true,
};

@Injectable()
export class WebsiteEffects {
  constructor(private createEffectSv: CreateEffectService) {}

  addWebsite$: Observable<Action> = this.createEffectSv.addEntity(entityInfo);
  loadWebsites$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
  updateWebsite$: Observable<Action> =
    this.createEffectSv.updateEntity(entityInfo);
  deleteWebsite$: Observable<Action> =
    this.createEffectSv.deleteEntity(entityInfo);
  deleteWebsites$: Observable<Action> =
    this.createEffectSv.deleteMany(entityInfo);
}
