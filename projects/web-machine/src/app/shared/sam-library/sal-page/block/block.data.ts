import { MenuAcionNames, NavbarItem } from '../../sal-menu/models';

export const START_LIST: NavbarItem[] = [
  {
    id: 'editSettings',
    icon: 'settings', 
    action: {
      name: MenuAcionNames.runLocalCommand
    }
  },
  {
    id: 'editStyle',
    icon: 'auto_fix_high', 
    action: {name: MenuAcionNames.runLocalCommand}
  },
];

export const END_LIST: NavbarItem[] = [
  {
    id: 'deleteBlock',
    icon: 'delete', 
    action: {
      name: MenuAcionNames.runLocalCommand
    }
  },
];