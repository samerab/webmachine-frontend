import { InjectionToken, Provider } from '@angular/core';
import { SidenavItem } from '../../../sal-sidenav/interfaces';

export const SIDEBAR_LIST = new InjectionToken<SidenavItem[]>(
  'grid_sal_sidebar_list'
);

export const GRID_PROVIDERS: Provider[] = [
  {
    provide: SIDEBAR_LIST,
    useFactory: sidebarFactory,
  },
];

function sidebarFactory() {
  return [
    {
      id: 'design',
      icon: 'grid_view',
      tip: 'grid design',
    },
    {
      id: 'createTemplage',
      icon: 'content_copy',
      tip: 'create grid template',
    },
    {
      id: 'createFixedGrid',
      icon: 'file_copy',
      tip: 'create fixed grid template',
    },
    {
      id: 'delete',
      icon: 'delete',
      tip: 'remove grid',
    },
  ];
}
