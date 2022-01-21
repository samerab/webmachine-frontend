import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  websiteTemplateId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor() { }
}
