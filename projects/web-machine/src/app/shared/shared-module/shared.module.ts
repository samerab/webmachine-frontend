import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SignWindowCommandDirective,
  SignWindowComponent,
} from './sign-window/sign-window.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SignWindowComponent, SignWindowCommandDirective],
  imports: [CommonModule, MatIconModule],
  exports: [SignWindowComponent, SignWindowCommandDirective],
})
export class SharedModule {}
