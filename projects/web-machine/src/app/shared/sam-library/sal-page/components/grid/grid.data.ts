import { NavbarItem } from '../../../sal-menu/models';
import { MenuAcionNames } from '../../../sal-menu/models';

export const START_LIST: NavbarItem[] = [
  {
    id: 'design',
    icon: 'architecture',
    label: { ar: 'design' },
    action: { name: MenuAcionNames.runLocalCommand },
  },
];

export const END_LIST: NavbarItem[] = [
  // {
  //   id: 'deleteGrid',
  //   icon: 'delete',
  //   label: { ar: 'delete grid' },
  //   action: { name: MenuAcionNames.runLocalCommand }
  // },
  // {
  //   id: 'collapseGrid',
  //   icon: 'collapse',
  //   label: { ar: 'collapse' },
  //   action: { name: MenuAcionNames.runLocalCommand }
  // },
];

export const MENU = {
  list: [
    {
      id: 'options',
      icon: 'more_vert',
      parentId: 'root',
    },
    {
      id: 'toggleGrid',
      icon: 'expand_less',
      label: 'collapse',
      parentId: 'options',
    },
    {
      id: 'createTemplage',
      icon: 'file_copy',
      label: 'create grid templage',
      parentId: 'options',
    },
    {
      id: 'createFixedGrid',
      icon: 'file_copy',
      label: 'create fixed grid',
      parentId: 'options',
    },
    {
      id: 'deleteGrid',
      icon: 'delete',
      label: 'delete grid',
      parentId: 'options',
    },
  ],
};
