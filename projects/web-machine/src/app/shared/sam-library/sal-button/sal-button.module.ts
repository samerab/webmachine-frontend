import { SalTranslateModule } from './../sal-translate/sal-translate.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalButtonComponent } from './button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConstructorButtonComponent } from './constructor-button/constructor-button.component';


@NgModule({
  declarations: [ConstructorButtonComponent, SalButtonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SalTranslateModule
  ],
  exports: [
    SalButtonComponent
  ]
})
export class SalButtonModule { }
