import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserDashboardService {
  websiteTemplateId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() {}

  genHomepage() {}
}
