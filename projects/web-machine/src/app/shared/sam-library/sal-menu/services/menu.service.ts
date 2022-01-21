import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAcionNames, MenuAction, TreeDataOptions, TreeItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private listToFill = []; 

  constructor(
    private router: Router,
    private window: Window,
  ) { }
  
  //rootToStartFrom: string, onlyParents = false
  getFamilyTree(menuItemList: TreeItem[], options?: TreeDataOptions) {
    const rootToStartFrom = options && options.rootToStartFrom
      ? options.rootToStartFrom
      : 'root';
    const onlyParents = options && options.onlyParents
      ? options.onlyParents
      : false;
    const parentList = this.getParentList(menuItemList, rootToStartFrom);
    let handledList = menuItemList.filter(item => item.parentId !== '0');
    this.fillFamily(parentList, handledList, onlyParents);
    return parentList;
  }

  getFamilyList(sourceList: TreeItem[], options?: TreeDataOptions) {
    const rootToStartFrom = options && options.rootToStartFrom
      ? options.rootToStartFrom
      : 'root';
      this.listToFill = [];
      const grand = sourceList.find(item => item.id === rootToStartFrom);
      if (!grand) return [];
      this.listToFill.push(grand);
    this.fillDescendants(rootToStartFrom, sourceList);
    return this.listToFill;
  }
  
  private fillDescendants(rootToStartFrom: string, sourceList: TreeItem[]) {
    const children = this.getChildren(rootToStartFrom, sourceList);
    this.listToFill = [...this.listToFill, ...children];
    for (const item of children) {
      this.fillDescendants(item.id, sourceList);
    }
  }

  private fillFamily(parentList: TreeItem[], handledList: TreeItem[], onlyParents: boolean) {
    if (handledList.length === 0 || !parentList) return;
    parentList.forEach((parent, index) => {
      let children;
      if (onlyParents) {
        children = this.getOnlyChildrenWithChildren(parent.id, handledList);
      }
      else {
        children = this.getChildren(parent.id, handledList);
      }
      if (children.length > 0) {
        parentList[index] = { ...parent, children };
        const idToDelete = handledList.findIndex(elem => elem.id === parent.id)
        if (idToDelete > -1) {
          handledList.splice(idToDelete, 1);
        }
      }
      const gChildren = parentList[index].children;
      if (gChildren) {
        this.fillFamily(gChildren, handledList, onlyParents);
      }

    })
  }

  private getParentList(menuItemList: TreeItem[], rootToStartFrom: string) {
    return menuItemList.filter(menuItem => menuItem.parentId === rootToStartFrom);
  }

  private getChildren(parentId: string, list: TreeItem[]) {
    const children = list.filter(item => item.parentId === parentId);
    return children;
  }

  private getOnlyChildrenWithChildren(parentId: string, list: TreeItem[]) {
    const childrenWithParentChildren = [];
    const children = list.filter(item => item.parentId === parentId);
    children.forEach(child => {
      if (child.children) {
        childrenWithParentChildren.push(child);
      }

    })
    return childrenWithParentChildren;
  }

  executeMenuAction(action: MenuAction) {
    switch (action?.name) {
      case MenuAcionNames.opeExternalLink:
        if (action.payload) {
          this.window.open(action.payload.url);
        }
        break;
      case MenuAcionNames.openPage:
        if (action.payload) {
          const fragment = action.payload.fragment;
          const path = action.payload.path;
          this.router.navigate([path], {fragment});
        }
        break;
      // case 'openReport':
      //   if (action.payload && action.payload.reportId) {
      //     // TO DO
      //   }
      //   break;
      case MenuAcionNames.dispatchAction:
        if (action?.payload?.action) {
          //this.store.dispatch(action.payload.action);
        }
    }
  }

}
