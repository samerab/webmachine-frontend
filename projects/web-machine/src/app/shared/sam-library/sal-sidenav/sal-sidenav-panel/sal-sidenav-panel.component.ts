import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sal-sidenav-panel',
  templateUrl: './sal-sidenav-panel.component.html',
  styleUrls: ['./sal-sidenav-panel.component.scss'],
})
export class SalSidenavPanelComponent implements OnInit {
  @Input() hasContent = false;
  @Input() hasDivider = true;
  @Input() lineHeight = '65px';

  constructor() {}

  ngOnInit(): void {}
}
