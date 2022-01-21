import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EffectsModule } from '@ngrx/effects';
import { PageEffects } from '../../store/page/page.effects';
import { ProductEffects } from '../../store/product/product.effects';
import { BlogEffects } from '../../store/blog/blog.effects';
import { FileEffects } from '../../store/file/file.effects';
import { SamMenuModule } from '@ws-sal';
import { GridTemplateEffects } from '../../store/grid-template/grid-template.effects';
import { PageTemplateEffects } from '../../store/page-template/page-template.effects';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    EffectsModule.forFeature([
      PageEffects,
      ProductEffects,
      BlogEffects,
      FileEffects,
      GridTemplateEffects,
      PageTemplateEffects,
    ]),
    SamMenuModule
  ]
})
export class DashboardModule { }
