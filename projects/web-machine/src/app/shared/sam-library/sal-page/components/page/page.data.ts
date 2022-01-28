import { MenuAcionNames, NavbarItem } from '../../../sal-menu/models';

export const START_LIST: NavbarItem[] = [
  {
    id: 'info',
    label: { ar: 'info' },
    icon: 'description',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
  {
    id: 'design',
    label: { ar: 'design' },
    icon: 'design_services',
    tip: 'show design mode',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
  {
    id: 'preview',
    label: { ar: 'preview' },
    icon: 'preview',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
  {
    id: 'realPreview',
    label: { ar: 'real preview' },
    icon: 'pageview',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
];

export const END_LIST: NavbarItem[] = [
  {
    id: 'createTemplage',
    icon: 'copy_all',
    label: 'create templage',
    tip: 'create template from this page',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
  {
    id: 'save',
    icon: 'save',
    action: {
      name: MenuAcionNames.runLocalCommand,
    },
  },
  // {
  //   id: 'addGrid',
  //   icon: 'add',
  //   label: {ar: 'add grid'},
  //   action: {
  //     name: MenuAcionNames.runLocalCommand
  //   }
  // }
];

export const ADD_GRID_MENU = {
  list: [
    { id: 'add', icon: 'add_circle', parentId: 'root' },
    { id: 'addBlank', icon: 'add', label: 'add blank grid', parentId: 'add' },
    { id: 'addFixed', icon: 'share', label: 'add fixed grid', parentId: 'add' },
    {
      id: 'addFromTemplate',
      icon: 'dns',
      label: 'add from template',
      parentId: 'add',
    },
  ],
};
