import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { PageService } from '../..';
import { SettingsData } from '../../page.model';

@Injectable({
  providedIn: 'root',
})
export class BlockSettingsService {
  constructor(private pageSv: PageService) {}

  get savedBlockSettings$(): Observable<SettingsData> {
    return this.pageSv.blockSettings$.pipe(
      filter(
        (settingsData) =>
          !!settingsData &&
          !!settingsData.settings &&
          settingsData.sender === 'block'
      ),
      take(1)
    );
  }

  send(settings) {
    this.pageSv.setBlockSettingsSubject.next({
      sender: 'settingsForm',
      settings,
    });
  }
}
