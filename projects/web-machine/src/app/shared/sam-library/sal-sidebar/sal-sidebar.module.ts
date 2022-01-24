import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalSidebarComponent } from './component/sal-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [SalSidebarComponent],
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  exports: [SalSidebarComponent],
})
export class SalSidebarModule {}
