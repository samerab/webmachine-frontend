import { SalCommonModule, SalPageModule, SamMenuModule, SalPopupModule, SalButtonModule } from '@ws-sal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplatesBrowserComponent } from './templates-browser/templates-browser.component';
import { TemplateCrudComponent } from './template-crud/template-crud.component';
import { PageFactoryModule } from '../../shared/page-factory/page-factory.module';
import { TemplateNamePipe } from './template-name.pipe';
import { TemplatesGalleryComponent } from './templates-gallery/templates-gallery.component';
import { ChangeNameComponent } from './change-name/change-name.component';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    TemplatesBrowserComponent, 
    TemplateCrudComponent, 
    TemplatesGalleryComponent,
    ChangeNameComponent,
    TemplateNamePipe
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    SalPageModule,
    PageFactoryModule,
    SalCommonModule,
    SamMenuModule,
    SalPopupModule,
    SalButtonModule,
    MatFormFieldModule,
  ]
})
export class TemplateModule { }
