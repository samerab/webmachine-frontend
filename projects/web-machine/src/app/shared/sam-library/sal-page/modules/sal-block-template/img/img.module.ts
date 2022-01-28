import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgComponent } from './img.component';
import { SalPageModule } from '../../..';

@NgModule({
  declarations: [ImgComponent],
  imports: [CommonModule, SalPageModule],
  //bootstrap: [ImgComponent],
})
export class ImgModule {
  getComponent() {
    return ImgComponent;
  }
}
