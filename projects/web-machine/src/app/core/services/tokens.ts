import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

/**
 * usage:
 * @Inject(DOCUMENT) private document: Document,
 * @Inject(WINDOW) private window: Window
 */
export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory: () => {
      const { defaultView } = inject(DOCUMENT);

      if (!defaultView) {
        throw new Error('Window is not available');
      }

      return defaultView;
    },
  }
);

export const test = new InjectionToken<any>('test', {
  factory: () => {
    return 'samer';
  },
});
