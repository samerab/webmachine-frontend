import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirClassDirective } from './dir-class.directive';
import { DirModifierDirective } from './dir-modifier.directive';
import { ColorDirective } from './color.directive';
import { SelectionClassDirective } from './selection-class.directive';
import { SalCommonModule } from '../sal-common/sal-common.module';

@NgModule({
  declarations: [
    DirClassDirective,
    DirModifierDirective,
    ColorDirective,
    SelectionClassDirective,
  ],
  exports: [
    DirClassDirective,
    DirModifierDirective,
    ColorDirective,
    SelectionClassDirective,
  ],
  imports: [CommonModule, SalCommonModule],
})
export class SalDirectiveModule {}
