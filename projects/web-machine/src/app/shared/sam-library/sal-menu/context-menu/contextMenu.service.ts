import { Injectable } from '@angular/core';
import { CONTEXT_MENU_ITEMS } from './context-menu';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

constructor() { }

getContextMenuItems(ids: string[]) {
  const contextMenuItems = [];
  for (const id of ids) {
    const item = CONTEXT_MENU_ITEMS.find(item => item.id === id);
    if (item) {
      contextMenuItems.push(item)
    }
  }
  return contextMenuItems;
}

}
