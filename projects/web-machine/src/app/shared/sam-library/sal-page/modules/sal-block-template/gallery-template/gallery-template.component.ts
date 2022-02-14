import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Style } from '../../../../sal-style/classes/style';
import { ValueUnit } from '../../../../sal-style/classes/value-unit';
import { createStyle } from '../../../../sal-style/styles';
import { Block, BlockTemplate } from '../../../page.model';

interface GalleryBlockTemplate extends Omit<Block, 'settings'> {
  settings: {
    fileList: any[];
    gridStyleList: {
      // imagesPerCol: any;
      // minWidth: any;
      gap: Style;
    };
    imgStyleList: {
      radius: Style;
      rotate: Style;
    };
  };
}

@Component({
  selector: 'gallery-template',
  templateUrl: './gallery-template.component.html',
  styleUrls: ['./gallery-template.component.scss'],
})
export class GalleryTemplateComponent
  implements OnInit, AfterViewInit, BlockTemplate
{
  @ViewChildren('img') imgList: QueryList<ElementRef<HTMLElement>>;
  data: GalleryBlockTemplate;
  styleList = [
    {
      id: 'padding',
      value: {
        'padding-top': {
          value: '30',
          unit: 'px',
        },
        'padding-right': {
          value: '30',
          unit: 'px',
        },
        'padding-bottom': {
          value: '30',
          unit: 'px',
        },
        'padding-left': {
          value: '30',
          unit: 'px',
        },
      },
    },
  ];

  constructor(private renderer: Renderer2, private host: ElementRef) {}

  ngOnInit(): void {
    const x = createStyle('margin', '33', 'px');
    console.log('xx', x);
  }

  ngAfterViewInit(): void {
    this.setDefault();
  }

  updateSettings(settings) {
    const copyData = { ...this.data };
    copyData.settings = { ...settings };
    this.data = { ...copyData };
    this.applySettings(settings);
    console.log('ggg', settings.gridStylelist['radius'] instanceof Style);
  }

  setDefault() {
    if (!this.data.settings) {
      // const defaultSettings = {
      //   fileList: [],
      //   imagesPerCol: { option: 'auto-fit', value: null },
      //   minWidth: { value: 100, unit: 'px' },
      //   gap: { value: 10, unit: 'px' },
      //   radius: { value: 10, unit: 'px' },
      //   rotate: { value: 0 },
      // };
      // this.data.settings = defaultSettings;
    } else {
      this.applySettings(this.data.settings);
    }
  }

  private applyGridStyle(gridStylelist) {
    for (const key in gridStylelist) {
      console.log('gridStylelist[key]', gridStylelist[key] instanceof Style);
      console.log(
        'gridStylelist[key]?.styleValue,',
        gridStylelist[key]?.styleValue
      );
      this.renderer.setStyle(
        this.host.nativeElement,
        gridStylelist[key]?.styleName,
        gridStylelist[key]?.styleValue
      );
    }
  }

  private applyImgStyle(imgStylelist) {
    this.imgList.forEach((img) => {
      for (const key in imgStylelist) {
        this.renderer.setStyle(
          img.nativeElement,
          imgStylelist[key]?.styleName,
          imgStylelist[key]?.styleValue
        );
      }
    });
  }

  applySettings(settings) {
    this.applyGridStyle(settings?.gridStyleList);
    this.applyImgStyle(settings?.imgStyleList);
  }
}
