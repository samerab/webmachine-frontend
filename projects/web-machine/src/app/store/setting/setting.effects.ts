// import { CreateEffectService, EntityInfo } from './../../core';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Action } from '@ngrx/store';
// import * as SettingActions from './setting.actions';

// const entityInfo: EntityInfo = {
//   name: 'setting',
//   actions: SettingActions
// }

// @Injectable()
// export class SettingEffects {

//   constructor(
//     private createEffectSv: CreateEffectService,
//   ) {}

//   loadSettings$: Observable<Action> = this.createEffectSv.loadAll(entityInfo);
//   updateSetting$: Observable<Action> = this.createEffectSv.updateEntity(entityInfo);
//   upsertSettings$: Observable<Action> = this.createEffectSv.upsertManyEntities(entityInfo);
//   deleteAllSettings$: Observable<Action> = this.createEffectSv.deleteAllEntities(entityInfo);



// }
