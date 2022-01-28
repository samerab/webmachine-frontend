import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { WebsitesTemplatesBrowserComponent } from './websites-templates-browser/websites-templates-browser.component';
import {
  SalBtnModule,
  SalContextMenuModule,
  SalDirectiveModule,
  SalPortalModule,
  SalSidenavModule,
  SalTableModule,
  SamMenuModule,
} from '@ws-sal';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { WebsiteCrudComponent } from './website-crud/website-crud.component';
import { EffectsModule } from '@ngrx/effects';
import { WebsiteEffects } from '@ws-store/website/website.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WebsiteListComponent } from './websiteList/websiteList.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    UserDashboardComponent,
    WebsitesTemplatesBrowserComponent,
    WebsiteCrudComponent,
    WebsiteListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserDashboardRoutingModule,
    SalSidenavModule,
    EffectsModule.forFeature([]),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    SamMenuModule,
    SalTableModule,
    SalContextMenuModule,
    SalPortalModule,
    SalBtnModule,
    SalDirectiveModule,
  ],
})
export class UserDashboardModule {}
