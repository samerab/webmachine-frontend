import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SalTableModule } from './../sal-table/sal-table.module';
import { SalButtonModule } from './../sal-button/sal-button.module';
import { SalTranslateModule } from './../sal-translate/sal-translate.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalStyleRoutingModule } from './sal-style-routing.module';
import { StyleBuilderComponent } from './style-builder/style-builder.component';
import { StyleFormComponent } from './style-form/style-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { SalPageModule } from '../sal-page';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SalInputModule } from '../sal-input/sal-input.module';

@NgModule({
  declarations: [StyleBuilderComponent, StyleFormComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SalStyleRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    SalTranslateModule,
    SalPageModule,
    SalButtonModule,
    SalTableModule,
    SalInputModule,
  ],
})
export class SalStyleModule {}
