import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeTemplateComponent } from './youtube-template.component';
import { SalPipeModule } from '../../../../pipes/sal-pipe.module';

@NgModule({
  declarations: [YoutubeTemplateComponent],
  imports: [CommonModule, SalPipeModule],
})
export class YoutubeTemplateModule {
  getComponent() {
    return YoutubeTemplateComponent;
  }
}
