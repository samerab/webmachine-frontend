import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'sal-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit {
  @Input() dir: Direction = 'ltr';
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  position = { x: '0px', y: '0px' };

  constructor() {}

  ngOnInit(): void {}

  openMenu(event: MouseEvent) {
    event.preventDefault();
    this.position.x = event.clientX + 'px';
    this.position.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }
}
