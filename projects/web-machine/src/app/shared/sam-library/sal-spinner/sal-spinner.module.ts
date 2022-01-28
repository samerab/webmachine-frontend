import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalSpinnerComponent } from './sal-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  declarations: [SalSpinnerComponent],
  exports: [SalSpinnerComponent],
})
export class SalSpinnerModule {}
