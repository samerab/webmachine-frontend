import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [ContextMenuComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [ContextMenuComponent],
})
export class ContextMenuModule {}
