import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteDashboardRoutingModule } from './website-dashboard-routing.module';
import { WebsiteLoginComponent } from './website-login/website-login.component';
import { SalSidenavModule, SalUserModule } from '@ws-sal';
import { WebsitedashboardComponent } from './dashboard/websitedashboard.component';
import { WebsiteDashbaordHeaderComponent } from './header/website-dashbaord-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { EffectsModule } from '@ngrx/effects';
import { PageEffects } from '@ws-store/page/page.effects';
import { ProductEffects } from '@ws-store/product/product.effects';
import { BlogEffects } from '@ws-store/blog/blog.effects';
import { FileEffects } from '@ws-store/file/file.effects';
import { GridTemplateEffects } from '@ws-store/grid-template/grid-template.effects';
import { PageTemplateEffects } from '@ws-store/page-template/page-template.effects';
import { SharedModule } from '../../shared/shared-module/shared.module';

@NgModule({
  declarations: [
    WebsiteLoginComponent,
    WebsitedashboardComponent,
    WebsiteDashbaordHeaderComponent,
  ],
  imports: [
    CommonModule,
    WebsiteDashboardRoutingModule,
    EffectsModule.forFeature([
      PageEffects,
      ProductEffects,
      BlogEffects,
      FileEffects,
      GridTemplateEffects,
      PageTemplateEffects,
    ]),
    SalUserModule,
    SalSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    SharedModule,
  ],
})
export class WebsiteDashboardModule {}
