import { SalBtnModule } from './../sal-btn/sal-btn.module';
import { SalPopupModule } from './../sal-popup/sal-popup.module';
import { SamMenuModule } from './../sal-menu/menu.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalFilesBrowserComponent } from './sal-files-browser/sal-files-browser.component';
import { SalButtonModule } from '../sal-button/sal-button.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImgInputComponent } from './imgInput/imgInput.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SalFilesBrowserComponent, ImgInputComponent],
  imports: [
    CommonModule,
    SalButtonModule,
    SamMenuModule,
    MatCheckboxModule,
    MatIconModule,
    SalBtnModule,
  ],
  exports: [SalFilesBrowserComponent, ImgInputComponent],
})
export class SalFileModule {}
