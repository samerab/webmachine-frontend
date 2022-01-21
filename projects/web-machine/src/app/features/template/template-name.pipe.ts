import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '@ws-sal';

@Pipe({
  name: 'templateName'
})
export class TemplateNamePipe implements PipeTransform {

  transform(page): string | null {
    return page?.info?.title
  }

}
