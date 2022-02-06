import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Block, BlockTemplate } from '../../../page.model';

interface YoutubeBlockTemplate extends Omit<Block, 'settings'> {
  settings: {
    src: string;
    allowFullScreen: boolean;
  };
}

@Component({
  selector: 'youtube-template',
  templateUrl: './youtube-template.component.html',
  styleUrls: ['./youtube-template.component.scss'],
})
export class YoutubeTemplateComponent implements OnInit, BlockTemplate {
  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
  data: YoutubeBlockTemplate;

  constructor() {}

  ngOnInit(): void {
    this.setDefault();
    setTimeout(() => {
      this.setFullscreen();
      this.iframe.nativeElement.setAttribute('allowfullscreen', '');
    }, 0);
  }

  updateSettings(settings) {
    this.data.settings = settings;
  }

  setDefault() {
    if (!this.data?.settings?.src) {
      const defaultData = {
        src: 'https://www.youtube.com/embed/20QSSefl8V4',
        allowFullScreen: true,
      };
      this.data.settings = defaultData;
    }
  }

  setFullscreen() {
    if (this.data.settings.allowFullScreen) {
      this.iframe.nativeElement.setAttribute('allowfullscreen', '');
    } else {
      this.iframe.nativeElement.removeAttribute('allowfullscreen');
    }
  }
}
