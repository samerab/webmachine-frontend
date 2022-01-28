import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

export class CustomEvent {
  name: any;
  value?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CustomEventService {
  subject$: BehaviorSubject<CustomEvent> = new BehaviorSubject<CustomEvent>(
    null
  );

  constructor() {}

  emit(event: CustomEvent) {
    this.subject$.next(event);
  }

  on(name: any) {
    return this.subject$.pipe(
      filter((event: CustomEvent) => event?.name === name),
      map((event) => event.value)
    );
  }
}
