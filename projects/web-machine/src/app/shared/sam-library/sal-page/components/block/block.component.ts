import { Block } from '../../page.model';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PageService } from '../../services/page.service';
import { BlockService } from './block.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ws-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent implements OnInit, OnDestroy {
  @ViewChild('blockContainer', { read: ViewContainerRef })
  blockContainer: ViewContainerRef;

  data: Block;
  currentBlockTemplate;
  sub: Subscription = new Subscription();

  constructor(public pageSv: PageService, private blockSv: BlockService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(async () => {
      this.onCloseAuxOutlet();
      await this.createAndSetCurrentBlockTemplate();
      this.setStyle();
    }, 0);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async createAndSetCurrentBlockTemplate() {
    this.currentBlockTemplate = await this.createSavedContent();
  }

  async createSavedContent() {
    return await this.blockSv.createContent(this.data, this.blockContainer);
  }

  setStyle() {
    if (this.data?.styleList?.length) {
      this.pageSv.applyStyle(this.data.styleList, this.blockTemplateHost);
    }
  }

  /**
   * access the host of this component(block host)
   * this is exactly => this.host.nativeElement
   */
  get blockDiv() {
    return (this.blockContainer.element.nativeElement as HTMLDivElement)
      .parentElement;
  }

  /**
   * access the host of block template component
   */
  get blockTemplateHost() {
    return this.blockDiv.children.item(1) as HTMLElement;
  }

  editStyle() {
    this.sub.add(
      this.pageSv
        .editStyle(this.data, this.blockTemplateHost)
        .subscribe((styleList) => {
          this.data = { ...this.data, styleList };
        })
    );
  }

  editSettings() {
    this.sub.add(
      this.blockSv.editSettings(this.data).subscribe((settings) => {
        this.currentBlockTemplate.updateSettings(settings);
        this.data = { ...this.data, settings };
      })
    );
  }

  onCloseAuxOutlet() {
    this.sub.add(
      this.pageSv.onCloseAuxOutlet$.subscribe(() => {
        this.pageSv.setPreviewMode(false);
        this.pageSv.setEditingMode(false);
      })
    );
  }

  deleteBlock() {
    this.blockSv.deleteBlock(this.data.id);
  }
}
