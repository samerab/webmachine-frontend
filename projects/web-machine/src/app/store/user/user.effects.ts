import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  EntityInfo,
  CreateEffectService,
} from '../../core/services/create-effect.service';
import * as userActions from './user.actions';
import { Action } from '@ngrx/store';

const entityInfo: EntityInfo = {
  name: 'user',
  actions: userActions,
};

@Injectable()
export class UserEffects {
  constructor(private createEffectSv: CreateEffectService) {}

  loginUser$: Observable<Action> = this.createEffectSv.loginUser(entityInfo);
  logoutUser$: Observable<Action> = this.createEffectSv.logoutUser(entityInfo);
  signupUser$: Observable<Action> = this.createEffectSv.signupUser(entityInfo);
  loadUser$: Observable<Action> = this.createEffectSv.loadOne(entityInfo);
}
