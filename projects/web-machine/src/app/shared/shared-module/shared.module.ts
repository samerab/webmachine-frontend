import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SignWindowCommandDirective,
  SignWindowComponent,
} from './sign-window/sign-window.component';
import { MatIconModule } from '@angular/material/icon';
import { ClientComponent } from './client/client.component';
import { SalPageModule } from '@ws-sal';

@NgModule({
  declarations: [
    SignWindowComponent,
    SignWindowCommandDirective,
    ClientComponent,
  ],
  imports: [CommonModule, MatIconModule, SalPageModule],
  exports: [SignWindowComponent, SignWindowCommandDirective],
})
export class SharedModule {}
