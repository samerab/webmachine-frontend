import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryTemplateComponent } from './gallery-template.component';

@NgModule({
  declarations: [GalleryTemplateComponent],
  imports: [CommonModule],
})
export class GalleryTemplateModule {
  getComponent() {
    return GalleryTemplateComponent;
  }
}
