import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalSidenavComponent } from './component/sal-sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { SalSidenavPanelComponent } from './sal-sidenav-panel/sal-sidenav-panel.component';

@NgModule({
  declarations: [SalSidenavComponent, SalSidenavPanelComponent],
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  exports: [SalSidenavComponent, SalSidenavPanelComponent],
})
export class SalSidenavModule {}
