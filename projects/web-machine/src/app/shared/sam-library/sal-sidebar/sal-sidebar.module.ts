import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalSidebarComponent } from './component/sal-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SalSidebarComponent],
  imports: [CommonModule, MatIconModule, MatExpansionModule, MatTooltipModule],
  exports: [SalSidebarComponent],
})
export class SalSidebarModule {}
