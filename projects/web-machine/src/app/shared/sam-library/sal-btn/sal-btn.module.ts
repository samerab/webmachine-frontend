import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalBtnComponent } from './sal-btn.component';
import { SalIconBtnDirective } from './directives/sal-icon-btn.directive';
import { IconBtnContentComponent } from './icon-btn-content/icon-btn-content.component';
import { MatIconModule } from '@angular/material/icon';
import { SalIconBtnComponent } from './sal-icon-btn/sal-icon-btn.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    SalBtnComponent,
    SalIconBtnDirective,
    IconBtnContentComponent,
    SalIconBtnComponent,
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [SalIconBtnDirective, SalBtnComponent, SalIconBtnComponent],
})
export class SalBtnModule {}
