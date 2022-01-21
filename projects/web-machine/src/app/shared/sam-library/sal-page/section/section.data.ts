import { MenuAcionNames, NavbarItem } from '../../sal-menu/models';

export const START_LIST: NavbarItem[] = [
  {
    id: 'addBlock',
    icon: 'add_circle', 
    action: {name: MenuAcionNames.runLocalCommand}
  },
  {
    id: 'editStyle',
    icon: 'settings_suggest', 
    action: {name: MenuAcionNames.runLocalCommand}
  },
];

export const END_LIST: NavbarItem[] = [];

export const SECTION_MENU_ITEMS = [
  {
    id: 'section',
    parentId: 'root',
    category: 'section',
    children: [],
    icon: 'add_circle',
},
  {
      id: 'addBlock',
      label: {
          ar: 'استعادة الإعدادات الإفتراضية', en: 'add block', de: 'admin'
      },
      icon: 'add_circle',
      parentId: 'section',
      category: 'section',
      canEdit: false,
      children: null,
      action: {name: MenuAcionNames.runLocalCommand}
  },
  {
    id: 'editStyle',
    label: {
        ar: 'استعادة الإعدادات الإفتراضية', en: 'edit style', de: 'admin'
    },
    icon: 'settings_suggest',
    parentId: 'section',
    category: 'section',
    canEdit: false,
    children: null,
    action: {name: MenuAcionNames.runLocalCommand}
},
];