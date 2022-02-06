import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Block, BlockTemplate } from '../../../page.model';
import { PageService } from '../../../services/page.service';

interface GalleryBlockTemplate extends Omit<Block, 'settings'> {
  settings: {
    fileList: any[];
    imagesPerCol: any;
    minWidth: any;
    gap: any;
    radius: any;
    rotate: any;
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

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    private pageSv: PageService
  ) {}

  ngOnInit(): void {
    this.setDefault();
    //this.setSettings();
    //this.applyGridStyle();
  }

  ngAfterViewInit() {
    this.applyImgStyle();
  }

  updateSettings(settings) {
    this.data.settings = settings;
  }

  setDefault() {
    if (!this.data?.settings) {
      const defaultData = {
        fileList: [],
        imagesPerCol: { option: 'auto-fit', value: null },
        minWidth: { value: 100, unit: 'px' },
        gap: { value: 10, unit: 'px' },
        radius: { value: 10, unit: 'px' },
        rotate: { value: 0 },
      };
      this.data.settings = defaultData;
    }
  }

  private applyGridStyle() {
    const imagesPerCol = this.pageSv.combineStyleParts(
      this.data.settings.imagesPerCol
    );
    const minWidth = this.pageSv.combineStyleParts(this.data.settings.minWidth);
    const gap = this.pageSv.combineStyleParts(this.data.settings.gap);
    this.renderer.setStyle(
      this.host.nativeElement,
      'grid-template-columns',
      `repeat(${imagesPerCol}, minmax(${minWidth}, 1fr))`
    );
    this.renderer.setStyle(this.host.nativeElement, 'grid-gap', gap);
    //this.renderer.setStyle(this.host.nativeElement, 'padding', gap);
  }

  private applyImgStyle() {
    const radius = this.pageSv.combineStyleParts(this.data.settings.radius);
    const rotate = this.pageSv.combineStyleParts(this.data.settings.rotate);
    this.imgList.forEach((img, index) => {
      this.renderer.setStyle(img.nativeElement, 'border-radius', radius);
      this.renderer.setStyle(
        img.nativeElement,
        'transform',
        `rotate(${rotate}deg)`
      );
    });
  }

  private setSettings() {
    if (Object.keys(this.data).length) {
      const settings = this.data;
      for (const [key, value] of Object.entries(settings)) {
        if (key !== 'fileList') {
          this.data.settings[key] = this.pageSv.combineStyleParts(value);
        } else {
          this.data.settings[key] = value as any;
        }
      }
    } else {
      for (const [key, value] of Object.entries(this.data.settings)) {
        this.data[key] = value;
      }
    }
  }
}
