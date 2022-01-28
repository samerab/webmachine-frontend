import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalPageModule } from '../../../sal-page.module';
import { TextComponent } from './text.component';

@NgModule({
  declarations: [TextComponent],
  imports: [CommonModule, SalPageModule],
})
export class TextModule {
  getComponent() {
    return TextComponent;
  }
}
