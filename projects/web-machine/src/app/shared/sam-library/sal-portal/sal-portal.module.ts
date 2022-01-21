import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalPortalComponent } from './sal-portal.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [CommonModule, PortalModule],
  declarations: [SalPortalComponent],
  exports: [PortalModule],
})
export class SalPortalModule {}
