import { PageService } from '../services/page.service';
import { BlockComponent } from '../block/block.component';
import { Block, Section } from '../page.model';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { END_LIST, SECTION_MENU_ITEMS, START_LIST } from './section.data';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { delay, filter, take, takeWhile, tap } from 'rxjs/operators';
import { ContentService } from '../services/content.service';
import { ResultsPopupComponent } from '../../sal-popup/resultsPopup/resultsPopup.component';
import { PopupService } from '../../sal-popup';
import { ClickedNavbarItem, MenuData } from '../../sal-menu/models';

@Component({
  selector: 'ws-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, AfterViewInit {

  @ViewChild('blockListContainer', { read: ViewContainerRef }) blockListContainer: ViewContainerRef;
  @ViewChild('blocksBoardTemplate') blocksBoardTemplate: TemplateRef<any>;
  @ViewChild('title') title: ElementRef<HTMLElement>;
  data: Section;
  blockListSubject: BehaviorSubject<Block[]> = new BehaviorSubject<Block[]>(null);
  isDesignMode = false;
  //isWaitingForStyle;
  menuData$: Observable<MenuData>;
  startList = START_LIST;
  endList = END_LIST;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;

  constructor(
    private contentSv: ContentService,
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    private popupSv: PopupService,
    private pageSv: PageService,
    private host: ElementRef,
  ) {
    this.menuData$ = of({ list: SECTION_MENU_ITEMS });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.onPreview();
    this.createBlocks();
    this.setProperties();
    //this.subToBlockList();
    this.subToAddBlock();
    //this.onBlockIdToDelete();
  }

  private onPreview() {
    this.pageSv.isPreviewMode$
      .pipe(
        takeWhile(isPreview => isPreview !== null),
        delay(0)
      )
      .subscribe(isPreview => {
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

  createBlocks() {
    this.blockListContainer.clear();
    this.createContent(this.data.blockList, this.blockListContainer);
  }

  private subToAddBlock() {
    this.pageSv.blockToAdd$
      .subscribe(blockToAdd => {
        const sectionId = blockToAdd.sectionId;
        if (sectionId === this.data.id) {
          blockToAdd = this.pageSv.getModifiedBlockToAdd(blockToAdd, 'color', this.data?.settings?.color);
          this.addBlock(blockToAdd.block);
          this.ref.detectChanges();
        }
      });
  }

  addBlock(block) {
    const instance = this.contentSv.createComponent(this.blockListContainer, BlockComponent, block);
    this.subToDeleteBlock(instance);
    this.renderer.setStyle(this.host.nativeElement, 'height', 'auto');
    const blockListCopy = [...this.data.blockList];
    block = {
      ...block, styleList: {
        "id": "padding",
        "value": {
          "padding-top": {
            "value": "70",
            "unit": "px"
          },
          "padding-right": {
            "value": "70",
            "unit": "px"
          },
          "padding-bottom": {
            "value": "70",
            "unit": "px"
          },
          "padding-left": {
            "value": "70",
            "unit": "px"
          }
        }
      }
    }
    blockListCopy.push(block);
    this.data = { ...this.data, blockList: blockListCopy };
  }

  // addBlock(block) {
  //   const blockListCopy = [...this.data.blockList];
  //   blockListCopy.push(block);
  //   this.data = { ...this.data, blockList: blockListCopy };
  //   const instance = this.contentSv.createComponent(this.blockListContainer, BlockComponent, block);
  //   this.subToDeleteBlock(instance);
  //   this.renderer.setStyle(this.host.nativeElement, 'height', 'auto');
  // }

  subToDeleteBlock(instace) {
    const block = instace as BlockComponent;
    block.deleteSubject
      .pipe(
        filter(id => !!id),
        tap(id => this.deleteBlock(id)),
        take(1)
      )
      .subscribe(id => {
        let xxx = 0;
        const interval = setInterval( () => console.log(`${id} => ${xxx+1}`), 1000);
        setTimeout(() => {
          clearInterval(interval)
        }, 1100);
      })
  }

  deleteBlock(blockId: string) {
    const blockIndex = this.data.blockList.findIndex(block => block.id === blockId);
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

  // handleInitialView(show: boolean) {
  //   const elem = this.blockListContainer.element.nativeElement as HTMLDivElement;
  //   show
  //     ? this.renderer.addClass(elem, 'blank-section')
  //     : this.renderer.removeClass(elem, 'blank-section');

  // }

  createContent(blockList: Block[], container: ViewContainerRef) {
    if (blockList?.length) {
      for (const block of blockList) {
        const instance = this.contentSv.createComponent(container, BlockComponent, block);
        this.subToDeleteBlock(instance);
      }
    }
  }

  setProperties() {
    //this.update();
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
      this.renderer.setStyle(this.title.nativeElement, 'backgroundColor', '#000000');
      this.renderer.setStyle(this.title.nativeElement, 'color', this.data.settings.color);
    }
  }

  private update() {
    this.blockListSubject.next(this.data.blockList);
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'addBlock':
        this.openBlocksPopup();
        break;
      case 'editStyle':
        this.pageSv.editStyle(this.data, this.sectionDiv);
    }
  }

  get sectionDiv() {
    return (this.blockListContainer.element.nativeElement as HTMLDivElement).parentElement;
  }

  openBlocksPopup() {
    const data = { id: this.data.id };
    this.dialogRef = this.popupSv.openPopup1(this.blocksBoardTemplate, data, {
      width: '1000px',
      height: '1000px'
    });
  }

  closeBlocksBoard() {
    this.dialogRef.close();
  }

}

