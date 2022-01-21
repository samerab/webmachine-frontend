import { SalTranslateModule } from './../sal-translate/sal-translate.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartInputComponent } from './smart-input/smart-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupInputComponent } from './popup-input/popup-input.component';
import { SalTableModule } from '../sal-table/sal-table.module';
import { StyleValueInputComponent } from './style-value-input/style-value-input.component';
import { MatSelectModule } from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';


@NgModule({
  declarations: [
    SmartInputComponent, 
    PopupInputComponent,
    StyleValueInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSliderModule,
    SalTableModule,
    SalTranslateModule
  ],
  exports: [
    SmartInputComponent,
    PopupInputComponent,
    StyleValueInputComponent,
  ]
})
export class SalInputModule { }
