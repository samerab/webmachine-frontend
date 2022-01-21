import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirClassDirective } from './dir-class.directive';
import { DirModifierDirective } from './dir-modifier.directive';
import { ColorDirective } from './color.directive';



@NgModule({
  declarations: [
    DirClassDirective,
    DirModifierDirective,
    ColorDirective,
  ],
  exports: [
    DirClassDirective,
    DirModifierDirective,
    ColorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SalDirectiveModule { }
