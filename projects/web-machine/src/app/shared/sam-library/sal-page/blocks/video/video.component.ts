import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BlockContent } from '../../page.model';

@Component({
  selector: 'ws-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, BlockContent {

  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
  data: {
    src: string;
    allowFullScreen: boolean;
  };

  src;
  allowFullScreen;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setSettings();
    }, 0);
  }

  private setSettings() {
    if (Object.keys(this.data).length) {
      this.src = this.data.src;
      if (this.data.allowFullScreen) {
        this.iframe.nativeElement.setAttribute('allowfullscreen', '');
      }
      else {
        this.iframe.nativeElement.removeAttribute('allowfullscreen');
      }
    }
  }

  onClick() {
    console.log('iframe')
  }
}
