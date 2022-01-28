import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgRoutingModule } from './img-routing.module';
import { ImgComponent } from './img.component';


@NgModule({
  declarations: [
    ImgComponent
  ],
  imports: [
    CommonModule,
    ImgRoutingModule
  ]
})
export class ImgModule { }
