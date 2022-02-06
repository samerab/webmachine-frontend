import {
  createNgModuleRef,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, takeUntil, tap } from 'rxjs';
import { CustomEventService } from '../../../sal-common/custom.event.service';
import { Block } from '../../page.model';
import { ContentService } from '../../services/content.service';
import { PageService } from '../../services/page.service';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  constructor(
    private injector: Injector,
    private contentSv: ContentService,
    private router: Router,
    public event: CustomEventService,
    private pageSv: PageService
  ) {}

  async createContent(block: Block, blockContainer: ViewContainerRef) {
    blockContainer.clear();
    const template = await this.lazyloadComponent(block);
    return this.contentSv.createComponent(blockContainer, template, block);
  }

  openBlockEditor(blockName: string) {
    this.router.navigate([
      { outlets: { blockSettings: `block-settings/${blockName}` } },
    ]);
  }

  sendSettingsFromBlockTemplate(value) {
    this.event.emit({
      name: 'settingsFromBlockTemplate',
      value,
    });
  }

  sendSettingsFromBlockEditor(value) {
    this.event.emit({
      name: 'settingsFromBlockEditor',
      value,
    });
  }

  deleteBlock(id: string) {
    this.event.emit({
      name: 'deleteBlockTemplate',
      value: id,
    });
  }

  editSettings(data: Block): Observable<any> {
    this.pageSv.setPreviewMode(true);
    this.pageSv.setEditingMode(true);
    this.openBlockEditor(data.component);
    this.sendSettingsFromBlockTemplate(data.settings);
    return this.fetchSettingsFromBlockEditor(data);
  }

  private fetchSettingsFromBlockEditor(data: Block) {
    return this.event.on('settingsFromBlockEditor').pipe(
      takeUntil(this.pageSv.onCloseAuxOutlet$),
      tap((settings) => {
        const updatedData = { ...data, settings };
        this.pageSv.updatePageContent(updatedData);
      })
    );
  }

  fetchSettingsFromBlockTemplate() {
    return this.event.on('settingsFromBlockTemplate').pipe(take(1));
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
