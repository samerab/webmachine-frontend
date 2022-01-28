import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BlockContent } from '../../../page.model';

@Component({
  selector: 'ws-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss'],
})
export class ImgComponent implements OnInit, BlockContent {
  data: { src: string };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setDefault();
  }

  setDefault() {
    const defaultData = {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkkt2d5SCjlasZW59t4b4w_ivBZrJODZsp4d6b3WQY1N-AbLCz2XEEcUx9ykVHUgXBok8&usqp=CAU',
    };
    this.data = defaultData;
  }

  test() {
    this.router.navigate([{ outlets: { auxOutlet: 'style' } }]);
  }
}
