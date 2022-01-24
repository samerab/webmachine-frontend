import {
  SamMenuModule,
  SalTranslateModule,
  SalPageModule,
  SalTableModule,
  SalPopupModule,
  SalContextMenuModule,
  SalBtnModule,
  SalPortalModule,
} from '@ws-sal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';

import { PageRoutingModule } from './page-routing.module';
import { PageCrudComponent } from './page-crud/page-crud.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PagesDashboardComponent } from './pages-dashboard/pages-dashboard.component';
import { PageInfoComponent } from './page-info/page-info.component';
import { PageFactoryModule } from '../../shared/page-factory/page-factory.module';

@NgModule({
  declarations: [PageCrudComponent, PageInfoComponent, PagesDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    PortalModule,
    SamMenuModule,
    SalTranslateModule,
    SalPageModule,
    SalTableModule,
    SalPopupModule,
    PageFactoryModule,
    SalContextMenuModule,
    SalBtnModule,
    SalPortalModule,
  ],
})
export class PageModule {}
