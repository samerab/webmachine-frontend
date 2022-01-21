import { SalDirectiveModule } from './../directives/sam-directive.module';
import { ResultsPopupComponent } from './resultsPopup/resultsPopup.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MessageComponent } from './message/message.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackMessageComponent } from './snack-message/snack-message.component';
import { SalTranslateModule } from '../sal-translate/sal-translate.module';
import { SalPipeModule } from '../pipes/sal-pipe.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { PopupService } from './popup-service/popup.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResultsPopupComponent,
    MessageComponent,
    SnackMessageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DragDropModule,
    SalTranslateModule,
    SalPipeModule,
    SalDirectiveModule,
  ],
  exports: [
  ],
  entryComponents: [
    ResultsPopupComponent,
    MessageComponent
  ],
  providers: [
    PopupService
  ]
})
export class SalPopupModule {
  // static forRoot(): ModuleWithProviders<SalPopupModule> {
  //   return {
  //     ngModule: SalPopupModule,
  //     providers: [ PopupService ]
  //   }
  // }
  
 }
