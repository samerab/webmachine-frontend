import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalSidenavComponent } from './component/sal-sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [SalSidenavComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [SalSidenavComponent]
})
export class SalSidenavModule { }
