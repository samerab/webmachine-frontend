import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  snackMsgSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() { }
}
