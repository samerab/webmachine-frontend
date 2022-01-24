import { Component, Input } from '@angular/core';

@Component({
  selector: 'sal-sidenav',
  templateUrl: './sal-sidenav.component.html',
  styleUrls: ['./sal-sidenav.component.scss'],
})
export class SalSidenavComponent {
  @Input() panelClass: string;
}
