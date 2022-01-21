import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-product-identity',
  templateUrl: './product-identity.component.html',
  styleUrls: ['./product-identity.component.scss']
})
export class ProductIdentityComponent implements OnInit {

  @Input() form;
  
  constructor() { }

  ngOnInit(): void {
  }

}
