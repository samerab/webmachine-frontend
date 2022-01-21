import { AppState } from './../../../store/index';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { of, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

constructor(
  private store: Store<AppState>,
  ) { }

  check(permission: string) {
    // if (!permission) {
    //   return from([null, null,false]);
    // }
    return from([null, null,true]);
  }

}
