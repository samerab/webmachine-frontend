import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CustomEventService } from '../sal-common/custom.event.service';
import { v4 as uuid } from 'uuid';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[selectionClass]',
})
export class SelectionClassDirective implements OnDestroy {
  @Input() selectionClass = '';
  id = uuid();
  sub: Subscription = new Subscription();

  constructor(
    private event: CustomEventService,
    private renderer: Renderer2,
    private host: ElementRef
  ) {
    this.onId();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('click') onClick() {
    this.event.emit({
      name: 'directiveHostClicked',
      value: this.id,
    });
  }

  onId() {
    this.sub.add(
      this.event.on('directiveHostClicked').subscribe((id) => {
        if (this.id === id) {
          this.renderer.addClass(this.host.nativeElement, this.selectionClass);
        } else {
          this.renderer.removeClass(
            this.host.nativeElement,
            this.selectionClass
          );
        }
      })
    );
  }
}
