import { MenuAcionNames, NavbarItem } from '@ws-sal';

export const START_LIST: NavbarItem[] = [
    {
      id: 'add',
      icon: 'add',
      action: {
        name: MenuAcionNames.runLocalCommand,
      }
    }
  ]

  export const END_LIST: NavbarItem[] = [
    {
      id: 'delete',
      icon: 'delete',
      action: {
        name: MenuAcionNames.runLocalCommand,
      }
    }
  ]