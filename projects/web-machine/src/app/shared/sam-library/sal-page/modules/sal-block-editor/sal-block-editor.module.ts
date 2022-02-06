import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalBlockEditorRoutingModule } from './sal-block-editor-routing.module';
import { SalCommonModule } from '../../../sal-common/sal-common.module';

@NgModule({
  imports: [CommonModule, SalBlockEditorRoutingModule, SalCommonModule],
  declarations: [],
})
export class SalBlockEditorModule {}
