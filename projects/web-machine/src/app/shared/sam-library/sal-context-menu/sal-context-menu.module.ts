import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalContextMenuComponent } from './context-menu.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [SalContextMenuComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [SalContextMenuComponent],
})
export class SalContextMenuModule {}
