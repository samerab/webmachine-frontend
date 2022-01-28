import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductCrudComponent } from './product-crud/product-crud.component';
import { ProductsDashboardComponent } from './products-dashboard/products-dashboard.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import {
  SalContextMenuModule,
  SalPopupModule,
  SalTableModule,
  SalTranslateModule,
  SamMenuModule,
} from '@ws-sal';
import { PageFactoryModule } from '../../shared/page-factory/page-factory.module';
import { ProductIdentityComponent } from './product-identity/product-identity.component';
import { ProductVariantsComponent } from './product-variants/product-variants.component';
import { ProductVarietyComponent } from './product-variety/product-variety.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProductInfoComponent,
    ProductCrudComponent,
    ProductsDashboardComponent,
    ProductIdentityComponent,
    ProductVariantsComponent,
    ProductVarietyComponent,
    ProductImagesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    SamMenuModule,
    SalTranslateModule,
    SalTableModule,
    SalPopupModule,
    PageFactoryModule,
    MatChipsModule,
    SalContextMenuModule,
  ],
})
export class ProductModule {}
