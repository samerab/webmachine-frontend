import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { PageService } from '../..';
import { CustomEventService } from '../../../sal-common/custom.event.service';

@Injectable({
  providedIn: 'root',
})
export class BlockSettingsService {
  constructor(private event: CustomEventService, private pageSv: PageService) {}

  fetch() {
    return this.event.on('settingsFromBlockTemplate').pipe(take(1));
  }

  send(value) {
    this.event.emit({
      name: 'settingsFromBlockEditor',
      value,
    });
  }
}
