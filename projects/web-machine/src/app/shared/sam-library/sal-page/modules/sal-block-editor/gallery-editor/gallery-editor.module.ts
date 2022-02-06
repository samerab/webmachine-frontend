import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryEditorRoutingModule } from './gallery-editor-routing.module';
import { GalleryEditorComponent } from './gallery-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SalInputModule } from '../../../../sal-input/sal-input.module';

@NgModule({
  declarations: [GalleryEditorComponent],
  imports: [
    CommonModule,
    GalleryEditorRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    SalInputModule,
  ],
})
export class GalleryEditorModule {}
