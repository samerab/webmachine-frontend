import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuItem } from '../models';
import { CONTEXT_MENU_ITEMS } from './context-menu';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'sam-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  @Input() contextMenuItems$: Observable<ContextMenuItem[] | string[]>;
  @Input() dir: Direction = 'rtl';
  @Output() itemClick: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  items: ContextMenuItem[] = [];
  position = { x: '0px', y: '0px' };
  sub: Subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.subToContextMenuItems();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private subToContextMenuItems() {
    this.sub.add(
      this.contextMenuItems$.subscribe(contextMenuItems => {
        this.items = this.generateContextMenuItems(contextMenuItems);
      })
    );
  }

  openMenu(event: MouseEvent) {
    event.preventDefault();
    this.position.x = event.clientX + 'px';
    this.position.y = event.clientY + 'px';
    //this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  generateContextMenuItems(contextMenuItems: ContextMenuItem[] | string[]) {
    const items = [];
    for (const contextMenuItem of contextMenuItems) {
      if (typeof contextMenuItem === 'string') {
        const item = CONTEXT_MENU_ITEMS.find(item => item.id === contextMenuItem);
        if (item) {
          items.push(item);
        }
      }
      else {
        items.push(contextMenuItem);
      }
    }
    return items;
  }

  onItemClick(id: string) {
    this.itemClick.emit(id);
  }

}
