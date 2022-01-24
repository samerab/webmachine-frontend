import { CdkPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PortalService } from './portal.service';

@Component({
  selector: 'sal-portal',
  templateUrl: './sal-portal.component.html',
  styleUrls: ['./sal-portal.component.scss'],
})
export class SalPortalComponent implements OnInit, AfterViewInit {
  @Input('hostId') id: string;
  @ViewChild(CdkPortal)
  private portal: CdkPortal;

  constructor(private portalSv: PortalService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.id) {
      const elem = document.querySelector(`[id=${this.id}]`);
      if (elem) {
        this.portalSv.attach(elem, this.portal);
      }
    }
  }
}
