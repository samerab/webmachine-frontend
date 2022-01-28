import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeComponent } from './youtube.component';
import { SalPipeModule } from '../../../../pipes/sal-pipe.module';

@NgModule({
  declarations: [YoutubeComponent],
  imports: [CommonModule, SalPipeModule],
})
export class YoutubeModule {
  getComponent() {
    return YoutubeComponent;
  }
}
