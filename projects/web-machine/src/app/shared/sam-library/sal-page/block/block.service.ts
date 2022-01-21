import { Injectable } from '@angular/core';
import { ClassicGalleryComponent } from '../blocks/classic-gallery/classic-gallery.component';
import { ClassicProductInfoComponent } from '../blocks/classic-product-info/classic-product-info.component';
import { ImgComponent } from '../blocks/img/img.component';
import { TextComponent } from '../blocks/text/text.component';
import { VideoComponent } from '../blocks/video/video.component';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor() { }

  getBlock(blockName: string) {
    return this.blockDataList.find(blockData => blockData.blockName === blockName)?.component;
  }

  blockDataList = [
    {
      file: 'youtube.svg',
      blockName: 'video',
      component: VideoComponent
    },
    {
      file: 'img.svg',
      blockName: 'img',
      component: ImgComponent
    },
    {
      file: 'img.svg',
      blockName: 'classic-gallery',
      component: ClassicGalleryComponent
    },
    {
      file: 'text.svg',
      blockName: 'text',
      component: TextComponent
    },
    {
      file: 'img.svg',
      blockName: 'classic-product-info',
      component: ClassicProductInfoComponent
    },
  ];

}

