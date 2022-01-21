import { PermissionDirective } from './permission.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    PermissionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionDirective
  ],
})
export class SalPermissionModule { }
