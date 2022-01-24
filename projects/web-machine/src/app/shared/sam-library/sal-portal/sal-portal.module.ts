import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalPortalComponent } from './sal-portal.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [SalPortalComponent],
  imports: [CommonModule, PortalModule],
  exports: [SalPortalComponent],
})
export class SalPortalModule {}
