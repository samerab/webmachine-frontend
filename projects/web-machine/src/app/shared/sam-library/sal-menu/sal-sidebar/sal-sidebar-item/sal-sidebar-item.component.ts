import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarItem } from '../../models';

@Component({
  selector: 'sal-sidebar-item',
  templateUrl: './sal-sidebar-item.component.html',
  styleUrls: ['./sal-sidebar-item.component.scss']
})
export class SalSidebarItemComponent implements OnInit {

  @Input() data: SidebarItem;
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {}

  emit() {
    if(this.data) {
      this.selected.next(this.data.path);
    }
  }

}
