import { MenuAcionNames, NavbarItem } from '../../sal-menu/models'

export const START_LIST: NavbarItem[] = [
  {
    id: 'delete',
    icon: 'delete',
    action: {
      name: MenuAcionNames.runLocalCommand,
    }
  },
  {
    id: 'upload',
    icon: 'upload',
    action: {
      name: MenuAcionNames.runLocalCommand,
    }
  },
  {
    id: 'download',
    icon: 'download',
    action: {
      name: MenuAcionNames.runLocalCommand,
    }
  },
]

export const END_LIST: NavbarItem[] = []