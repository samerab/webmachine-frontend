import { SalFileModule, SalPageModule } from '@ws-sal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFactoryComponent } from './page-factory/page-factory.component';

@NgModule({
  declarations: [PageFactoryComponent],
  imports: [CommonModule, SalPageModule, SalFileModule],
  exports: [PageFactoryComponent],
})
export class PageFactoryModule {}
