import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalIconComponent } from './sal-icon.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [SalIconComponent],
  exports: [SalIconComponent],
})
export class SalIconModule {}
