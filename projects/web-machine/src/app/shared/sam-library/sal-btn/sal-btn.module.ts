import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SalBtnGroupComponent } from './sal-btn-group/sal-btn-group.component';
import { SalBtnComponent } from './sal-btn/sal-btn.component';

@NgModule({
  declarations: [SalBtnComponent, SalBtnGroupComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [SalBtnComponent, SalBtnGroupComponent],
})
export class SalBtnModule {}
