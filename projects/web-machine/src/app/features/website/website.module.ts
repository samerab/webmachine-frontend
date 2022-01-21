import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website/website.component';
import { SalPageModule } from '@ws-sal';


@NgModule({
  declarations: [WebsiteComponent],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SalPageModule
  ]
})
export class WebsiteModule { }
