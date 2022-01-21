import { SalNormalActionName } from './../../sal-common/event.service';
import { SalPageEvent, SalPageEventName } from './../services/page.service';
import { Block, SettingsData } from '../page.model';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { END_LIST, START_LIST } from './block.data';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { PageService } from '../services/page.service';
import { ContentService } from '../services/content.service';
import { BlockService } from './block.service';
import { ClickedNavbarItem } from '../../sal-menu/models';
import { EventService, SalEventName } from '../../sal-common/event.service';

@Component({
  selector: 'ws-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

  @ViewChild('blockContainer', { read: ViewContainerRef }) blockContainer: ViewContainerRef;
  @ViewChild('title') title: ElementRef<HTMLElement>;
  data: Block;
  blockSubject: BehaviorSubject<Block> = new BehaviorSubject<Block>(null);
  deleteSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startList = START_LIST;
  endList = END_LIST;
  isDesignMode;
  currentComponent;

  constructor(
    private contentSv: ContentService,
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    private pageSv: PageService,
    private blockSv: BlockService,
    private eventSv: EventService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isDesignMode = true;
      this.onPreview();
      this.onCloseAuxOutlet();
      this.createBlock();
      this.setStyle();
    }, 0);
  }

  private createBlock() {
    this.blockContainer.clear();
    this.currentComponent = this.createContent(this.data, this.blockContainer);
    //this.ref.detectChanges();
  }

  setStyle() {
    //this.pageSv.applyStyle(this.data.styleList, this.blockDiv);
    if (!this.data.styleList) {
      //this.data.styleList = this.currentComponent.styleList;
      const copyData = { ...this.data };
      copyData.styleList = this.currentComponent.styleList;
      this.data = { ...copyData };
    }
    this.pageSv.applyStyle(this.data.styleList, this.blockDiv.children.item(1) as HTMLElement);
  }

  private onPreview() {
    this.pageSv.isPreviewMode$
      .pipe(
        takeWhile(isPreview => isPreview !== null)
      )
      .subscribe(isPreview => {
        this.isDesignMode = !isPreview;
        if (!isPreview) {
          setTimeout(() => {
            this.setTitleColor();
          }, 0);
        }
      });
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'deleteBlock':
        this.deleteBlock();
        break;
      case 'editSettings':
        /** show preview mode */
        this.pageSv.emit(new SalPageEvent(SalPageEventName.SET_VIEW_MODE, true));
        /** hide main sidebar */
        this.eventSv.emit({
          name: SalNormalActionName.SET_VIEW_MODE,
          value: true
        })
        this.editSettings(this.data, this.blockContainer);
        break;
      case 'editStyle':
        //this.pageSv.editStyle(this.data, this.blockDiv);
        this.pageSv.editStyle(this.data, this.blockDiv.children.item(1) as HTMLElement);
    }
  }

  editSettings(block: Block, blockContainer) {
    this.pageSv.openBlockSettings(block.component);
    let { color, ...settings } = block.settings;
    settings = Object.keys(settings).length ? settings : this.currentComponent.settings;
    this.pageSv.setBlockSettingsSubject.next({ sender: 'block', settings });
    this.subToBlockSettings(block, blockContainer);
  }

  private subToBlockSettings(block: Block, blockContainer) {
    this.pageSv.blockSettings$
      .pipe(
        takeUntil(this.pageSv.onCloseAuxOutlet$),
        filter(settingsData => !!settingsData && settingsData.sender === 'settingsForm')
      )
      .subscribe((settingsData: SettingsData) => {
        this.applySettings(block, blockContainer, settingsData.settings);
      });
  }

  onCloseAuxOutlet() {
    /** cancel preview mode and back to design mode */
    this.pageSv.onCloseAuxOutlet$
    .subscribe(_ => {
      this.pageSv.emit(new SalPageEvent(SalPageEventName.SET_VIEW_MODE, false))
      //this.pageSv.setPreviewModeSubject.next(false)
    })
  }

  applySettings(block: Block, blockContainer, settings: any) {
    const newBlock = { ...block, settings };
    blockContainer.remove(0);
    this.currentComponent = this.createContent(newBlock, blockContainer);
    this.data = { ...newBlock };
    setTimeout(() => {
      this.pageSv.applyStyle(this.data.styleList, this.blockDiv.children.item(1) as HTMLElement)
    }, 0);
    this.pageSv.updatePageContent(this.data);
  }

  get blockDiv() {
    return (this.blockContainer.element.nativeElement as HTMLDivElement).parentElement;
  }

  private setTitleColor() {
    if (this.title && this.data.settings?.color) {
      this.renderer.setStyle(this.title.nativeElement, 'backgroundColor', '#000000');
      this.renderer.setStyle(this.title.nativeElement, 'color', this.data.settings.color);
    }
  }

  deleteBlock() {
    this.deleteSubject.next(this.data.id)
  }

  createContent(block: Block, container: ViewContainerRef) {
    const component = this.blockSv.getBlock(block.component);
    const { color, ...settings } = block.settings;
    return this.contentSv.createComponent(container, component, settings);
  }

}
