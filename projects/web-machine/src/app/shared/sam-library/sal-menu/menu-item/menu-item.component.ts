import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuItem } from '../models';

interface NavItem {
  displayName: string;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'sam-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {

  @Input() items: MenuItem[];
  @Input() lang: string = 'ar';
  @Output() onchildClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  @ViewChild('childMenu', { static: true }) public childMenu: any;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;

  constructor() {}

  onchildClicked(item: MenuItem) {
    this.onchildClick.emit(item);
  }
}
