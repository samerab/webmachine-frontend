import { InjectionToken, Provider } from '@angular/core';

export interface BlockTemplateInfo {
  file: string;
  blockName: string;
}

export const BLOCK_TEMPLATE_LIST = new InjectionToken<BlockTemplateInfo[]>(
  'BLOCK_TEMPLATE_LIST'
);

export const SECTION_PROVIDERS: Provider[] = [
  {
    provide: BLOCK_TEMPLATE_LIST,
    useFactory: blockTemplateInfoFactory,
  },
];

function blockTemplateInfoFactory() {
  return [
    {
      file: 'youtube.svg',
      blockName: 'youtube',
    },
    {
      file: 'img.svg',
      blockName: 'img',
    },
    {
      file: 'gallery.svg',
      blockName: 'gallery',
    },
    {
      file: 'text.svg',
      blockName: 'text',
    },
    {
      file: 'text.svg',
      blockName: 'menu-bar',
    },
  ];
}
