import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuBarEditorRoutingModule } from './menu-bar-editor-routing.module';
import { MenuBarEditorComponent } from './menu-bar-editor.component';


@NgModule({
  declarations: [
    MenuBarEditorComponent
  ],
  imports: [
    CommonModule,
    MenuBarEditorRoutingModule
  ]
})
export class MenuBarEditorModule { }
