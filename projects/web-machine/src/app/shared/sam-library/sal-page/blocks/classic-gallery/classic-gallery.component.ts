import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { BlockContent } from '../../page.model';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'ws-classic-gallery',
  templateUrl: './classic-gallery.component.html',
  styleUrls: ['./classic-gallery.component.scss']
})
export class ClassicGalleryComponent implements OnInit, AfterViewInit, BlockContent {

  @ViewChildren('img') imgList: QueryList<ElementRef<HTMLElement>>;
  data;
  styleList = [
    {
        "id": "padding",
        "value": {
            "padding-top": {
                "value": "30",
                "unit": "px"
            },
            "padding-right": {
                "value": "30",
                "unit": "px"
            },
            "padding-bottom": {
                "value": "30",
                "unit": "px"
            },
            "padding-left": {
                "value": "30",
                "unit": "px"
            }
        }
    }
];
  settings = {
    fileList: [],
    imagesPerCol: { option: 'auto-fit', value: null },
    minWidth: { value: 100, unit: 'px' },
    gap: { value: 10, unit: 'px' },
    radius: { value: 10, unit: 'px' },
    rotate: { value: 0 }
  };

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    private pageSv: PageService
  ) { }

  ngOnInit(): void {
    this.setSettings();
    this.applyGridStyle();
  }

  ngAfterViewInit() {
    this.applyImgStyle();
  }

  private applyGridStyle() {
    const imagesPerCol = this.pageSv.combineStyleParts(this.settings.imagesPerCol);
    const minWidth = this.pageSv.combineStyleParts(this.settings.minWidth);
    const gap = this.pageSv.combineStyleParts(this.settings.gap);
    this.renderer.setStyle(this.host.nativeElement, 'grid-template-columns', `repeat(${imagesPerCol}, minmax(${minWidth}, 1fr))`);
    this.renderer.setStyle(this.host.nativeElement, 'grid-gap', gap);
    //this.renderer.setStyle(this.host.nativeElement, 'padding', gap);
  }

  private applyImgStyle() {
    const radius = this.pageSv.combineStyleParts(this.settings.radius);
    const rotate = this.pageSv.combineStyleParts(this.settings.rotate);
    this.imgList.forEach((img, index) => {
      this.renderer.setStyle(img.nativeElement, 'border-radius', radius);
      this.renderer.setStyle(
        img.nativeElement,
        'transform',
        `rotate(${rotate}deg)`);
    });
  }


  private setSettings() {
    if (Object.keys(this.data).length) {
      const settings = this.data;
      for (const [key, value] of Object.entries(settings)) {
        if (key !== 'fileList') {
          this.settings[key] = this.pageSv.combineStyleParts(value);
        }
        else {
          this.settings[key] = value as any;
        }
      }
    }
    else {
      for (const [key, value] of Object.entries(this.settings)) {
        this.data[key] = value;
      }
    }
  }

}
