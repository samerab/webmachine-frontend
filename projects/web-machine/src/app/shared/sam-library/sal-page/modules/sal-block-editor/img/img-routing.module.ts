import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImgComponent } from './img.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ImgComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImgRoutingModule {}
