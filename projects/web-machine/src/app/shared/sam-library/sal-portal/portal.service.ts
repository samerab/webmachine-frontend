import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private host: DomPortalOutlet;

  constructor(
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  attach(domElement: Element, portal: CdkPortal) {
    this.host = new DomPortalOutlet(
      domElement,
      this.cfr,
      this.appRef,
      this.injector
    );
    this.host.attach(portal);
  }
}
