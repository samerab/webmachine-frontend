import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarTemplateComponent } from './menu-bar-template.component';

@NgModule({
  declarations: [MenuBarTemplateComponent],
  imports: [CommonModule],
})
export class MenuBarTemplateModule {
  getComponent() {
    return MenuBarTemplateComponent;
  }
}
