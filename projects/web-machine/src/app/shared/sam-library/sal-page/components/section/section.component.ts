import { PageService, SalPageEventName } from '../../services/page.service';
import { BlockComponent } from '../block/block.component';
import { Block, Section } from '../../page.model';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { END_LIST, SECTION_MENU_ITEMS, START_LIST } from './section.data';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { delay, takeWhile } from 'rxjs/operators';
import { ContentService } from '../../services/content.service';
import { ResultsPopupComponent } from '../../../sal-popup/resultsPopup/resultsPopup.component';
import { PopupService } from '../../../sal-popup';
import { ClickedNavbarItem, MenuData } from '../../../sal-menu/models';
import { SectionService } from './section.service';
import {
  BlockTemplateInfo,
  BLOCK_TEMPLATE_LIST,
  SECTION_PROVIDERS,
} from './section-providers';

@Component({
  selector: 'ws-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  providers: [SECTION_PROVIDERS],
})
export class SectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('blockListContainer', { read: ViewContainerRef })
  blockListContainer: ViewContainerRef;
  @ViewChild('blocksBoardTemplate') blocksBoardTemplate: TemplateRef<any>;
  @ViewChild('title') title: ElementRef<HTMLElement>;
  data: Section;
  blockListSubject: BehaviorSubject<Block[]> = new BehaviorSubject<Block[]>(
    null
  );
  isDesignMode = false;
  menuData$: Observable<MenuData>;
  startList = START_LIST;
  endList = END_LIST;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  sub: Subscription = new Subscription();

  constructor(
    private contentSv: ContentService,
    private renderer: Renderer2,
    private popupSv: PopupService,
    private pageSv: PageService,
    private host: ElementRef,
    private sectionSv: SectionService,
    @Inject(BLOCK_TEMPLATE_LIST) private blockTemplateList: BlockTemplateInfo[]
  ) {
    this.menuData$ = of({ list: SECTION_MENU_ITEMS });
  }

  ngOnInit(): void {
    this.onDelete();
  }

  ngAfterViewInit() {
    this.onPreview();
    this.createSavedContent();
    this.setProperties();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createSavedContent() {
    this.blockListContainer.clear();
    const blockList = this.data?.blockList;
    if (blockList?.length) {
      for (const block of blockList) {
        const instance = this.contentSv.createComponent(
          this.blockListContainer,
          BlockComponent,
          block
        );
      }
    }
  }

  createContent(blockName: string) {
    const blockToAdd = this.sectionSv.genBlockToAdd(blockName, this.data.id);
    this.sectionSv.createBlockTemplate(
      blockToAdd,
      this.data,
      this.blockListContainer
    );
    this.updateData(blockToAdd.block);
    this.sectionSv.updeteGridList(this.data.id, blockToAdd.block);
  }

  private onDelete() {
    this.sub.add(
      this.pageSv
        .on(SalPageEventName.delete_block)
        .subscribe((id) => this.deleteBlock(id))
    );
  }

  onSelectBlockTempate(blockName: string) {
    this.createContent(blockName);
    this.closeBlocksBoard();
  }

  private onPreview() {
    this.pageSv.isPreviewMode$
      .pipe(
        takeWhile((isPreview) => isPreview !== null),
        delay(0)
      )
      .subscribe((isPreview) => {
        this.removeDesignStyle();
        this.isDesignMode = !isPreview;
        if (!isPreview) {
          this.addDesignStyle();
          setTimeout(() => {
            this.setTitleColor();
          }, 0);
        }
      });
  }

  updateData(block) {
    this.renderer.setStyle(this.host.nativeElement, 'height', 'auto');
    const blockListCopy = [...this.data.blockList];
    block = {
      ...block,
      styleList: {
        id: 'padding',
        value: {
          'padding-top': {
            value: '70',
            unit: 'px',
          },
          'padding-right': {
            value: '70',
            unit: 'px',
          },
          'padding-bottom': {
            value: '70',
            unit: 'px',
          },
          'padding-left': {
            value: '70',
            unit: 'px',
          },
        },
      },
    };
    blockListCopy.push(block);
    this.data = { ...this.data, blockList: blockListCopy };
  }

  deleteBlock(blockId: string) {
    const blockIndex = this.data.blockList.findIndex(
      (block) => block.id === blockId
    );
    if (blockIndex > -1) {
      const copyBlockList = [...this.data.blockList];
      copyBlockList.splice(blockIndex, 1);
      this.data = { ...this.data, blockList: copyBlockList };
      this.blockListContainer.remove(blockIndex);
      this.pageSv.updateDataSubject.next(this.data);
    }
  }

  addDesignStyle() {
    this.renderer.addClass(this.host.nativeElement, 'design-view');
  }

  removeDesignStyle() {
    this.renderer.removeClass(this.host.nativeElement, 'design-view');
  }

  setProperties() {
    this.setLayout();
    this.setStyle();
  }

  setLayout() {
    this.renderer.setStyle(this.host.nativeElement, 'grid-area', 'auto');
    this.applyLayout(this.data.layout);
    this.setTitleColor();
  }

  applyLayout(layout) {
    if (layout) {
      for (const [key, value] of Object.entries(layout)) {
        this.renderer.setStyle(this.host.nativeElement, key, value);
      }
    }
  }

  setStyle() {
    this.pageSv.applyStyle(this.data.styleList, this.sectionDiv);
  }

  private setTitleColor() {
    if (this.title && this.data.settings?.color) {
      this.renderer.setStyle(
        this.title.nativeElement,
        'backgroundColor',
        '#000000'
      );
      this.renderer.setStyle(
        this.title.nativeElement,
        'color',
        this.data.settings.color
      );
    }
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'addBlock':
        this.openBlocksPopup();
        break;
      case 'editStyle':
        this.pageSv.showPrevieMode();
        this.pageSv.editStyle(this.data, this.sectionDiv);
    }
  }

  get sectionDiv() {
    return (this.blockListContainer.element.nativeElement as HTMLDivElement)
      .parentElement;
  }

  openBlocksPopup() {
    this.dialogRef = this.popupSv.openPopup1(
      this.blocksBoardTemplate,
      this.blockTemplateList,
      {
        width: '1000px',
        height: '1000px',
      }
    );
  }

  closeBlocksBoard() {
    this.dialogRef.close();
  }
}
