import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalPageModule } from '../../../sal-page.module';
import { GalleryComponent } from './gallery.component';

@NgModule({
  declarations: [GalleryComponent],
  imports: [CommonModule, SalPageModule],
  bootstrap: [GalleryComponent],
})
export class GalleryModule {
  getComponent() {
    return GalleryComponent;
  }
}
