import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-classic-product-info',
  templateUrl: './classic-product-info.component.html',
  styleUrls: ['./classic-product-info.component.scss']
})
export class ClassicProductInfoComponent implements OnInit {

  @Input() title;
  
  constructor() { }

  ngOnInit(): void {
  }

}
