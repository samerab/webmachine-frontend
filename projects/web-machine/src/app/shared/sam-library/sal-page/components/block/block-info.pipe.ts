import { Pipe, PipeTransform } from '@angular/core';
import { Block } from '../../page.model';

@Pipe({
  name: 'blockInfo',
})
export class BlockInfoPipe implements PipeTransform {
  transform(data: Block): any {
    return `${data.component}`;
  }
}
