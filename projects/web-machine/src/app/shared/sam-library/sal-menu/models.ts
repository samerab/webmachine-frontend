import { TranslateObj } from "../sal-translate/translate-obj";
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';


export interface DragDropInfo {
  hostNode;
  guestNode;
  action;
}

export class TreeItem {
  id: string;
  parentId: string;
  children?: TreeItem[];
  category?: string;
}

export class TreeDataOptions {
  rootToStartFrom?: string;
  onlyParents?: boolean;
}

export class ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  permission?: string;
}

export class NavbarItem {
  id?: string;
  label?: TranslateObj | string;
  icon?: string;
  action?: MenuAction;
  disabled?: Observable<boolean>;
  tip?: string;
}

export class MenuData {
  list: MenuItem[] | any[];
  rootToStartFrom?: string;
  onlyParents?: boolean;
}

export class MenuItem {
  id: string;
  parentId: string;
  label?: TranslateObj | string;
  category?: string;
  canEdit?: boolean;
  icon?: string;
  action?: MenuAction;
  children?: MenuItem[];
  order?: number;

  constructor(data?: any) {
    if (!data || !data.hasOwnProperty('id')) {
      this.id = uuid();
    }
    if (!data || !data.hasOwnProperty('canEdit')) {
      this.canEdit = true;
    }
    for (let key in data) {
      this[key] = data[key];
    }
  }

}

export interface MenuAction {
  name?: MenuAcionNames;
  payload?: MenuActionPayload;
}

export interface MenuActionPayload {
  name?: string;
  path?: string;
  fragment?: string;
  url?: string;
  id?: string;
  action?: any;
}

export enum MenuAcionNames {
  opeExternalLink = 'opeExternalLink',
  openPage = 'openPage',
  openReport = 'openReport',
  dispatchAction = 'dispatchAction',
  runLocalCommand = 'runLocalCommand'
}

export interface PageInfoSubject {
  pageInfoSubject: BehaviorSubject<any>;
  defaultPageInfoSubject: BehaviorSubject<any>;
}

export class SidebarItem {
  title: string;
  path: string;
  icon: string;
  hidden?: boolean;

  constructor() {
      this.hidden = false;
  }
}

export class ClickedNavbarItem {
  id: string;
  event: MouseEvent
}