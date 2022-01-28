import { SalFileModule } from './../sal-file/sal-file.module';
import { SalPopupModule } from './../sal-popup/sal-popup.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockSettingsRoutingModule } from './block-settings-routing.module';
import { ImgSettingsComponent } from './img-settings/img-settings.component';
import { VideoSettingsComponent } from './video-settings/video-settings.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ReactiveFormsModule } from '@angular/forms';
import { SalPageModule } from '../sal-page';
import { ClassicGallerySettingsComponent } from './classic-gallery-settings/classic-gallery-settings.component';
import { SalInputModule } from '../sal-input/sal-input.module';
import { SalCommonModule } from '../sal-common/sal-common.module';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { MatSelectModule } from '@angular/material/select';
import { SearchOrPasteComponent } from './text-editor/search-or-paste/search-or-paste.component';
import { LineHeightComponent } from './text-editor/line-height/line-height.component';
import { SalButtonModule } from '../sal-button/sal-button.module';

@NgModule({
  declarations: [
    ImgSettingsComponent,
    VideoSettingsComponent,
    ClassicGallerySettingsComponent,
    TextEditorComponent,
    SearchOrPasteComponent,
    LineHeightComponent,
  ],
  imports: [
    CommonModule,
    BlockSettingsRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSelectModule,
    DragDropModule,
    SalPageModule,
    SalInputModule,
    SalPopupModule,
    SalFileModule,
    SalCommonModule,
    SalButtonModule,
  ],
})
export class SalBlockSettingsModule {}
