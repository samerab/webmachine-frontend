import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextRoutingModule } from './text-routing.module';
import { TextComponent } from './text.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SalPopupModule } from '../../../../sal-popup';
import { SalCommonModule } from '../../../../sal-common/sal-common.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchOrPasteComponent } from './search-or-paste/search-or-paste.component';
import { LineHeightComponent } from './line-height/line-height.component';
import { SalButtonModule } from '../../../../sal-button/sal-button.module';

@NgModule({
  declarations: [TextComponent, SearchOrPasteComponent, LineHeightComponent],
  imports: [
    CommonModule,
    TextRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    DragDropModule,
    MatAutocompleteModule,
    SalPopupModule,
    SalCommonModule,
    SalButtonModule,
  ],
})
export class TextModule {}
