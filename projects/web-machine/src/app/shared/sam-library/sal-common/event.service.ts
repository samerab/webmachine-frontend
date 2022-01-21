import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum SalEventName {
  UPLOAD_FILES = 'uploadedFiles',
  DELETE_FILES = 'deletedFiles',
  ADD_FIXED_GRID_TEMPLATE = 'addFixedGridTemplate',
  ADD_GRID_TEMPLATE = 'addGridTemplate',
  SET_VIEW_MODE = 'setViewMode'

}

export class SalEvent {
  name: SalEventName | any;
  value?: any;
}

export enum SalActionName {
  ADD_ONE = 'addOne',
  ADD_MANY = 'addMany',
  UPDATE_ONE = 'updateOne',
  UPDATE_MANY = 'updateMany',
  DELETE_ONE = 'deleteOne',
  DELETE_MANY = 'deleteMany',
  UPLOAD_FILES = 'uploadFiles',
  EDIT = 'edit',
}

export enum SalNormalActionName {
  SET_VIEW_MODE = 'setViewMode'
}

export interface SalAction {
  entity?: string;
  name: SalActionName | any;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  //subject$: Subject<SalEvent> = new Subject<SalEvent>();
  subject$: BehaviorSubject<SalEvent> = new BehaviorSubject<SalEvent>(null);

  constructor() { }

  emit(event: SalEvent) {
    this.subject$.next(event);
  }

  on(SalEventName: SalEventName) {
    return this.subject$.pipe(
      filter((event: SalEvent) => event?.name === SalEventName),
      map(event => event.value),
    )
  }

}
