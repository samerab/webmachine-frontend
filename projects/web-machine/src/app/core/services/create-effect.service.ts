import { RoutingService } from './routing.service';
import { loadFiles } from './../../store/file/file.actions';
import { endLoading, startLoading } from './../../store/common/common.actions';
import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  CreateEffectMetadata,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageType, PopupService } from '@ws-sal';
import { AppState } from '@ws-store/index';
import { failure } from '@ws-store/common/common.actions';
import { Observable, of } from 'rxjs';
import { map, exhaustMap, catchError, concatMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { K } from '@angular/cdk/keycodes';

export interface EntityInfo {
  name: string;
  actions: any;
  detach?: boolean;
}

export class BackendResponse {
  success: boolean;
  data?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateEffectService {
  constructor(
    private actions$: Actions,
    private apiSv: ApiService,
    private popupSv: PopupService,
    private store: Store<AppState>,
    private userSv: UserService,
    private routingSv: RoutingService
  ) {}

  getPlural(entity: string) {
    const lastChar = entity.substr(entity.length - 1);
    if (lastChar === 'y') {
      return entity.slice(0, entity.length - 1) + 'ies';
    }
    return entity + 's';
  }

  private getEntityVariables(entityInfo: EntityInfo) {
    const entity = entityInfo.name;
    const entityPlural = this.getPlural(entity);
    const entityActions = entityInfo.actions;
    const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    const capitalEntityPlural = this.getPlural(capitalEntity);
    return {
      entity,
      entityPlural,
      entityActions,
      capitalEntity,
      capitalEntityPlural,
    };
  }

  private handleError(err: any, showMsg = true) {
    this.store.dispatch(endLoading());
    if (showMsg) {
      //const message = err.error.message ? err.error.message : err.message;
      const message = err?.error ? err.error.message : err.message;
      this.popupSv.showMsg({ message, type: MessageType.Error });
    }
    return of(failure({ err }));
  }

  split(str: string) {
    return str.split('|samSplit|');
  }

  loginUser(entityInfo: EntityInfo) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityInfo.actions['loginUser']),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv.loginUser(action['user']).pipe(
            map((response) => {
              this.store.dispatch(endLoading());
              return entityInfo.actions['loginUserSuccess']({
                user: (response as BackendResponse)?.data,
              });
            }),
            catchError((err) => {
              this.routingSv.navigate('loginUser');
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  logoutUser(entityInfo: EntityInfo) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityInfo.actions['logoutUser']),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv.logoutUser().pipe(
            map(() => {
              this.store.dispatch(endLoading());
              return entityInfo.actions['logoutUserSuccess']();
            }),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  signupUser(entityInfo: EntityInfo) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityInfo.actions['addUser']),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv.signupUser(action['user']).pipe(
            map((response) => {
              this.store.dispatch(endLoading());
              this.routingSv.navigate('emailConfirmation');
              return entityInfo.actions['addUserSuccess']({
                user: (response as BackendResponse)?.data,
              });
            }),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  // sendRequest(
  //   action,
  //   apiMethod: ()=>Observable<Object>,
  //   responseMethod: (response: BackendResponse)=>any
  //   )  {
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(action),
  //       concatMap(() => {
  //         this.store.dispatch(startLoading());
  //         return apiMethod()
  //           .pipe(
  //             tap((_) =>
  //             this.store.dispatch(endLoading())
  //             ),
  //             map((response) => responseMethod((response as BackendResponse))),
  //             catchError((err) => {
  //               return this.handleError(err);
  //             })
  //           );
  //       })
  //     )
  //   );
  // }

  loadOne(entityInfo: EntityInfo) {
    const entity = this.getEntityVariables(entityInfo);
    const load = `load${entity.capitalEntity}`;
    const loadSuccess = `load${entity.capitalEntity}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entity.entityActions[load]),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv
            .loadOne(entity.entityPlural, action['id'], entityInfo.detach)
            .pipe(
              map((response) => {
                this.store.dispatch(endLoading());
                return entity.entityActions[loadSuccess]({
                  [entity.entity]: (response as BackendResponse)?.data,
                });
              }),
              catchError((err) => {
                return this.handleError(err);
              })
            );
        })
      )
    );
  }

  private getEntityData(
    entityInfo: EntityInfo,
    actionCommand = '',
    plural = false
  ) {
    const name = entityInfo.name;
    const pluralName = this.getPlural(name);
    const entityActions = entityInfo.actions;
    const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    const capitalpluralName = this.getPlural(capitalName);
    const entCapitalName = plural ? capitalpluralName : capitalName;
    const entName = plural ? pluralName : name;
    const command = `${actionCommand}${entCapitalName}`;
    const commandSuccess = `${actionCommand}${entCapitalName}Success`;
    const action = entityActions[command];
    const actionSuccess = entityActions[commandSuccess];
    return {
      action,
      actionSuccess,
      entName,
    };
  }

  sendRequest(
    entityInfo: EntityInfo,
    actionCommand: string,
    apiMethod: (actionPayload) => Observable<Object>,
    plural = false
  ) {
    const entity = this.getEntityData(entityInfo, actionCommand, plural);
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entity.action),
        concatMap((actionPayload) => {
          this.store.dispatch(startLoading());
          return apiMethod(actionPayload).pipe(
            tap((_) => this.store.dispatch(endLoading())),
            map((response) => {
              return entity.actionSuccess({
                [entity.entName]: (response as BackendResponse)?.data,
              });
            }),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  // sendRequest(
  //   entityInfo: EntityInfo,
  //   actionCommand: string,
  //   apiMethod: () => Observable<Object>,
  //   plural = false
  // ) {
  //   const entity = this.getEntityData(entityInfo, actionCommand, plural);
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entity.action),
  //       concatMap(() => {
  //         this.store.dispatch(startLoading());
  //         return apiMethod().pipe(
  //           tap((_) => this.store.dispatch(endLoading())),
  //           map((response) => {
  //             return entity.actionSuccess({
  //               [entity.entName]: (response as BackendResponse)?.data,
  //             });
  //           }),
  //           catchError((err) => {
  //             return this.handleError(err);
  //           })
  //         );
  //       })
  //     )
  //   );
  // }

  loadAll(entityInfo: EntityInfo) {
    const name = this.getEntityData(entityInfo, '', true).entName;
    return this.sendRequest(
      entityInfo,
      'load',
      () => this.apiSv.loadAll(name),
      true
    );
  }

  loadMany(entityInfo: EntityInfo) {
    const name = this.getEntityData(entityInfo, '', true).entName;
    return this.sendRequest(
      entityInfo,
      'loadMany',
      () => this.apiSv.loadMany(name, entityInfo.detach),
      true
    );
  }

  deleteEntity11(entityInfo: EntityInfo) {
    const data = this.getEntityData(entityInfo, '', true);
    const name = data.entName;
    return this.sendRequest(
      entityInfo,
      'delete',
      (actionPayload) => {
        return this.apiSv.deleteOne(
          name,
          actionPayload['id'],
          entityInfo.detach
        );
      },
      true
    );
  }

  // loadAll(entityInfo: EntityInfo) {
  //   const entity = this.getEntityVariables(entityInfo);
  //   const load = `load${entity.capitalEntityPlural}`;
  //   const loadSuccess = `load${entity.capitalEntityPlural}Success`;
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entity.entityActions[load]),
  //       exhaustMap(() => {
  //         this.store.dispatch(startLoading());
  //         return this.apiSv.loadAll(entity.entityPlural).pipe(
  //           map((response) => {
  //             this.store.dispatch(endLoading());
  //             return entity.entityActions[loadSuccess]({
  //               [entity.entityPlural]: (response as BackendResponse)?.data,
  //             });
  //           }),
  //           catchError((err) => {
  //             return this.handleError(err);
  //           })
  //         );
  //       })
  //     )
  //   );
  // }

  addEntity(entityInfo: EntityInfo) {
    const entity = this.getEntityVariables(entityInfo);
    const add = `add${entity.capitalEntity}`;
    const addSuccess = `add${entity.capitalEntity}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entity.entityActions[add]),
        concatMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv
            .addOne(
              entity.entityPlural,
              action[entity.entity],
              entityInfo.detach
            )
            .pipe(
              map((_) => {
                this.store.dispatch(endLoading());
                return entity.entityActions[addSuccess]({
                  [entity.entity]: action[entity.entity],
                });
              }),
              tap((_) =>
                this.popupSv.openSnackBar('message.successfully_added')
              ),
              catchError((err) => {
                return this.handleError(err);
              })
            );
        })
      )
    );
  }

  addMany(entityInfo: EntityInfo) {
    const entity = this.getEntityVariables(entityInfo);
    const add = `add${entity.capitalEntityPlural}`;
    const addSuccess = `add${entity.capitalEntityPlural}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entity.entityActions[add]),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv
            .addMany(entity.entityPlural, action[entity.entityPlural])
            .pipe(
              map((response) => {
                this.store.dispatch(endLoading());
                if (entity.entity === 'file') {
                  return loadFiles();
                }
                return entity.entityActions[addSuccess]({
                  [entity.entityPlural]: action[entity.entityPlural],
                });
              }),
              catchError((err) => {
                return this.handleError(err);
              })
            );
        })
      )
    );
  }

  updateEntity(entityInfo: EntityInfo) {
    const { entity, entityPlural, entityActions, capitalEntity } =
      this.getEntityVariables(entityInfo);
    const update = `update${capitalEntity}`;
    const updateSuccess = `update${capitalEntity}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityActions[update]),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          const { id, ...payload } = action[entity];
          return this.apiSv.updateOne(entityPlural, id, payload.changes).pipe(
            map((response) => {
              this.store.dispatch(endLoading());
              return entityActions[updateSuccess]({ [entity]: action[entity] });
            }),
            tap((_) =>
              this.popupSv.openSnackBar('message.successfully_updated')
            ),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  updateManyEntity(entityInfo: EntityInfo) {
    const { entityPlural, entityActions, capitalEntityPlural } =
      this.getEntityVariables(entityInfo);
    const update = `update${capitalEntityPlural}`;
    const updateSuccess = `update${capitalEntityPlural}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityActions[update]),
        exhaustMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv.updateMany(entityPlural, action[entityPlural]).pipe(
            map((response) => {
              this.store.dispatch(endLoading());
              return entityActions[updateSuccess]({
                [entityPlural]: action[entityPlural],
              });
            }),
            tap((_) =>
              this.popupSv.openSnackBar('message.successfully_updated')
            ),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  deleteEntity(entityInfo: EntityInfo) {
    const { entityPlural, entityActions, capitalEntity } =
      this.getEntityVariables(entityInfo);
    const deleteAction = `delete${capitalEntity}`;
    const deleteSuccess = `delete${capitalEntity}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityActions[deleteAction]),
        concatMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv
            .deleteOne(entityPlural, action['id'], entityInfo.detach)
            .pipe(
              map((response) => {
                this.store.dispatch(endLoading());
                return entityActions[deleteSuccess]({ id: action['id'] });
              }),
              tap((_) =>
                this.popupSv.openSnackBar('message.successfully_deleted')
              ),
              catchError((err) => {
                return this.handleError(err);
              })
            );
        })
      )
    );
  }

  deleteMany(entityInfo: EntityInfo) {
    const { entityPlural, entityActions, capitalEntityPlural } =
      this.getEntityVariables(entityInfo);
    const deleteAction = `delete${capitalEntityPlural}`;
    const deleteSuccess = `delete${capitalEntityPlural}Success`;
    return createEffect(() =>
      this.actions$.pipe(
        ofType(entityActions[deleteAction]),
        concatMap((action) => {
          this.store.dispatch(startLoading());
          return this.apiSv.deleteMany(entityPlural, action['ids']).pipe(
            tap((_) => {
              this.store.dispatch(endLoading());
              this.popupSv.openSnackBar('message.successfully_deleted');
            }),
            map((_) => {
              return entityActions[deleteSuccess]({ ids: action['ids'] });
            }),
            catchError((err) => {
              return this.handleError(err);
            })
          );
        })
      )
    );
  }

  // updateManyEntities(entityInfo: EntityInfo) {
  //   const entity = entityInfo.name;
  //   const entityActions = entityInfo.actions;
  //   const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  //   const capitalEntityPlural = this.getPlural(capitalEntity);
  //   const entityPlural = this.getPlural(entity);
  //   const update = `update${capitalEntityPlural}`;
  //   const updateSuccess = `update${capitalEntityPlural}Success`;
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entityActions[update]),
  //       exhaustMap(action => {
  //         const entityData = { entity, data: action[entityPlural] };
  //         return this.apiSv.updateMany(entityData)
  //           .pipe(
  //             map((response: BackendResponse) => {
  //               return entityActions[updateSuccess]({ [entityPlural]: action[entityPlural] });
  //             }),
  //             tap(_ =>  this.popupSv.openSnackBar('message.successfully_updated')),
  //             catchError((err) => {
  //               this.popupSv.showMsg({message: err.error.message, type: MessageType.Error});
  //               return of(failure({err}))
  //             })
  //           )
  //       })
  //     )
  //   );
  // }

  // upsertEntity(entityInfo: EntityInfo) {
  //   const entity = entityInfo.name;
  //   const entityActions = entityInfo.actions;
  //   const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  //   const update = `upsert${capitalEntity}`;
  //   const updateSuccess = `upsert${capitalEntity}Success`;
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entityActions[update]),
  //       exhaustMap(action => {
  //         const entityData = { entity, data: action[entity] };
  //         return this.apiSv.upsertOne(entityData)
  //           .pipe(
  //             map((response: BackendResponse) => {
  //               return entityActions[updateSuccess]({ [entity]: action[entity] });
  //             }),
  //             tap(_ =>  this.popupSv.openSnackBar('message.successfully_updated')),
  //             catchError((err) => {
  //               this.popupSv.showMsg({message: err.error.message, type: MessageType.Error});
  //               return of(failure({err}))
  //             })
  //           )
  //       })
  //     )
  //   );
  // }

  // upsertManyEntities(entityInfo: EntityInfo) {
  //   const entity = entityInfo.name;
  //   const entityActions = entityInfo.actions;
  //   const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  //   const capitalEntityPlural = this.getPlural(capitalEntity);
  //   const entityPlural = this.getPlural(entity);
  //   const update = `upsert${capitalEntityPlural}`;
  //   const updateSuccess = `upsert${capitalEntityPlural}Success`;
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entityActions[update]),
  //       exhaustMap(action => {
  //         const entityData = { entity, data: action[entityPlural] };
  //         console.log('entityData--',entityData)
  //         return this.apiSv.upsertMany(entityData)
  //           .pipe(
  //             map((response: BackendResponse) => {
  //               return entityActions[updateSuccess]({ [entityPlural]: action[entityPlural] });
  //             }),
  //             tap(_ =>  this.popupSv.openSnackBar('message.successfully_updated')),
  //             catchError((err) => {
  //               this.popupSv.showMsg({message: err.error.message, type: MessageType.Error});
  //               return of(failure({err}))
  //             })
  //           )
  //       })
  //     )
  //   );
  // }

  // deleteAllEntities(entityInfo: EntityInfo) {
  //   const entity = entityInfo.name;
  //   const entityActions = entityInfo.actions;
  //   const capitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  //   const capitalEntityPlural = this.getPlural(capitalEntity);
  //   const deleteAction = `clear${capitalEntityPlural}`;
  //   const deleteSuccess = `clear${capitalEntityPlural}Success`;
  //   return createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(entityActions[deleteAction]),
  //       concatMap( _ => {
  //         const entityData = { entity, data: null };
  //         return this.apiSv.deleteAll(entityData)
  //           .pipe(
  //             map( _ => {
  //               return entityActions[deleteSuccess]();
  //             }),
  //             tap( _ =>  this.popupSv.openSnackBar('message.successfully_deleted')),
  //             catchError((err) => {
  //               this.popupSv.showMsg({message: err.error.message, type: MessageType.Error});
  //               return of(failure({err}))
  //             })
  //           )
  //       })
  //     )
  //   );
  // }
}
