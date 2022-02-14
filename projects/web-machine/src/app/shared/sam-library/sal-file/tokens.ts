import { EventEmitter, InjectionToken } from '@angular/core';
import { SalFile } from '../models/sal-file.models';

export interface FilesBrowser {
  onSelect: EventEmitter<SalFile[]>;
}

export const FILES_BROWSER = new InjectionToken<FilesBrowser>(
  'files browser token'
);
