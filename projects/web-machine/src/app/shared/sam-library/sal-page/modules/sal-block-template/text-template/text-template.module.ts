import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalPageModule } from '../../../sal-page.module';
import { TextTemplateComponent } from './text-template.component';

@NgModule({
  declarations: [TextTemplateComponent],
  imports: [CommonModule, SalPageModule],
})
export class TextTemplateModule {
  getComponent() {
    return TextTemplateComponent;
  }
}
