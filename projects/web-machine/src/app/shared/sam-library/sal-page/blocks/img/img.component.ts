import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BlockContent } from '../../page.model';

@Component({
  selector: 'ws-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, BlockContent {

  data: {src: string};
  src = 'https://media.designrush.com/tinymce_images/79179/conversions/website-dimensions-content.jpg';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setSettings()
  }

  private setSettings() {
    if (Object.keys(this.data).length) {
      this.src = this.data.src;
    }
  }

  test() {
    this.router.navigate([{ outlets: { auxOutlet: 'style' } }]);
  }

}
