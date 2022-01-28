import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Block, BlockToAdd } from '../../page.model';
import { ContentService } from '../../services/content.service';
import { PageService } from '../../services/page.service';
import { BlockComponent } from '../block/block.component';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(private pageSv: PageService, private contentSv: ContentService) {}

  createBlockTemplate(blockToAdd: BlockToAdd, data, blockListContainer) {
    const odifiedBlockToAdd = this.pageSv.getModifiedBlockToAdd(
      blockToAdd,
      'color',
      data?.settings?.color
    );
    return this.contentSv.createComponent(
      blockListContainer,
      BlockComponent,
      odifiedBlockToAdd.block
    );
  }

  genBlockToAdd(blockName: string, sectionId: string): BlockToAdd {
    const block = {
      id: uuid(),
      component: blockName,
    };
    return {
      sectionId,
      block,
    };
  }

  updeteGridList(sectionId, block: Block) {
    this.pageSv.addBlockSubject.next({
      sectionId,
      block,
    });
  }
}
