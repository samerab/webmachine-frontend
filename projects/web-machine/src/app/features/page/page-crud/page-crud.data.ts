import { MenuAcionNames, NavbarItem } from '@ws-sal'

export const START_LIST: NavbarItem[] = [
  {
    id: 'info',
    label: { ar: 'info' },
    icon: 'description',
    action: {
      name: MenuAcionNames.runLocalCommand,
    }
  },
  {
    id: 'design',
    label: { ar: 'design' },
    icon: 'design_services',
    action: {
      name: MenuAcionNames.runLocalCommand
    }
  }, {
    id: 'preview',
    label: { ar: 'preview' },
    icon: 'preview',
    action: {
      name: MenuAcionNames.runLocalCommand
    }
  },
]

export const END_LIST: NavbarItem[] = [
  {
    id: 'save',
    label: { ar: 'save' },
    icon: 'save',
    action: {
      name: MenuAcionNames.runLocalCommand
    }
  },
  {
    id: 'addGrid',
    icon: 'add', 
    label: {ar: 'add grid'},
    action: {
      name: MenuAcionNames.dispatchAction,
      payload: {
      }
    }
  }
]