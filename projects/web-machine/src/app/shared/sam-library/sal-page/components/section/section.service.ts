import {
  createNgModuleRef,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import { CustomEventService } from '../../../sal-common/custom.event.service';
import { Block, BlockToAdd } from '../../page.model';
import { ContentService } from '../../services/content.service';
import { PageService } from '../../services/page.service';
import { BlockComponent } from '../block/block.component';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(
    private pageSv: PageService,
    private contentSv: ContentService,
    private event: CustomEventService,
    private injector: Injector
  ) {}

  async createContent(block: Block, blockContainer: ViewContainerRef) {
    //blockContainer.clear();
    const template = await this.lazyloadComponent(block);
    return this.contentSv.createComponent(blockContainer, template, block);
  }

  createBlockTemplate(block: Block, data, blockListContainer) {
    // const odifiedBlockToAdd = this.pageSv.getModifiedBlockToAdd(
    //   block,
    //   'color',
    //   data?.settings?.color
    // );
    return this.contentSv.createComponent(
      blockListContainer,
      BlockComponent,
      block
    );
  }

  genBlock(blockName: string, sectionId: string): Block {
    const block = {
      id: uuid(),
      component: blockName,
      sectionId,
    };
    return block;
  }

  updeteGridList(block: Block) {
    this.event.emit({
      name: 'updateGridListWithNewBlock',
      value: block,
    });
  }

  /**
   * lazy loading components
   */

  private async lazyloadComponent(block: Block) {
    const blockName = block.component + '-template';
    const capitalBockName = blockName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    const moduleName = capitalBockName + 'Module';
    const obj = await import(
      `../../modules/sal-block-template/${blockName}/${blockName}.module`
    );
    const mod = obj[moduleName];
    const moduleRef = createNgModuleRef(mod, this.injector);
    const template = moduleRef.instance['getComponent']();
    return template;
  }
}
