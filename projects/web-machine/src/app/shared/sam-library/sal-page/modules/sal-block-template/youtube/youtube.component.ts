import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
})
export class YoutubeComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
  data: {
    src: string;
    allowFullScreen: boolean;
  };

  constructor() {}

  ngOnInit(): void {
    this.setDefault();
    setTimeout(() => {
      this.setFullscreen();
      this.iframe.nativeElement.setAttribute('allowfullscreen', '');
    }, 0);
  }

  setDefault() {
    if (!this.data?.src) {
      const defaultData = {
        src: 'https://www.youtube.com/embed/20QSSefl8V4',
        allowFullScreen: true,
      };
      this.data = defaultData;
    }
  }

  setFullscreen() {
    if (this.data.allowFullScreen) {
      this.iframe.nativeElement.setAttribute('allowfullscreen', '');
    } else {
      this.iframe.nativeElement.removeAttribute('allowfullscreen');
    }
  }
}
