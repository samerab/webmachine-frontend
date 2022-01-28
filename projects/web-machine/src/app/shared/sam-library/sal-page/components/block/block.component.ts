import { SalNormalActionName } from '../../../sal-common/event.service';
import { SalPageEvent, SalPageEventName } from '../../services/page.service';
import { Block, SettingsData } from '../../page.model';
import {
  Component,
  createNgModuleRef,
  ElementRef,
  Injector,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { END_LIST, START_LIST } from './block.data';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { PageService } from '../../services/page.service';
import { ContentService } from '../../services/content.service';
import { ClickedNavbarItem } from '../../../sal-menu/models';
import { EventService } from '../../../sal-common/event.service';

@Component({
  selector: 'ws-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent implements OnInit {
  @ViewChild('blockContainer', { read: ViewContainerRef })
  blockContainer: ViewContainerRef;
  @ViewChild('title') title: ElementRef<HTMLElement>;
  data: Block;
  blockSubject: BehaviorSubject<Block> = new BehaviorSubject<Block>(null);
  startList = START_LIST;
  endList = END_LIST;
  isDesignMode;
  currentComponent;

  constructor(
    private contentSv: ContentService,
    private renderer: Renderer2,
    private pageSv: PageService,
    private eventSv: EventService,
    private injector: Injector
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(async () => {
      this.isDesignMode = true;
      this.onPreview();
      this.onCloseAuxOutlet();
      await this.createBlock();
      this.setStyle();
    }, 0);
  }

  private async createBlock() {
    this.blockContainer.clear();
    this.currentComponent = await this.createContent(
      this.data,
      this.blockContainer
    );
  }

  /**
   * lazy loading components
   */
  async createContent(block: Block, container: ViewContainerRef) {
    const moduleName = block.component + 'Module';
    const capital = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const obj = await import(
      `../../modules/sal-block-template/${block.component}/${block.component}.module`
    );
    const mod = obj[capital];
    const moduleRef = createNgModuleRef(mod, this.injector);
    const template = moduleRef.instance['getComponent']();
    const { color, ...settings } = block.settings;
    return this.contentSv.createComponent(container, template, settings);
  }

  setStyle() {
    //this.pageSv.applyStyle(this.data.styleList, this.blockDiv);
    if (!this.data.styleList) {
      //this.data.styleList = this.currentComponent.styleList;
      const copyData = { ...this.data };
      copyData.styleList = this.currentComponent.styleList;
      this.data = { ...copyData };
    }
    this.pageSv.applyStyle(
      this.data.styleList,
      this.blockDiv.children.item(1) as HTMLElement
    );
  }

  private onPreview() {
    this.pageSv.isPreviewMode$
      .pipe(takeWhile((isPreview) => isPreview !== null))
      .subscribe((isPreview) => {
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
        this.pageSv.showPrevieMode();
        // this.pageSv.emit(
        //   new SalPageEvent(SalPageEventName.SET_VIEW_MODE, true)
        // );
        /** hide main sidebar */
        this.eventSv.emit({
          name: SalNormalActionName.SET_VIEW_MODE,
          value: true,
        });
        this.editSettings(this.data, this.blockContainer);
        break;
      case 'editStyle':
        //this.pageSv.editStyle(this.data, this.blockDiv);
        this.pageSv.editStyle(
          this.data,
          this.blockDiv.children.item(1) as HTMLElement
        );
    }
  }

  editSettings(block: Block, blockContainer) {
    this.pageSv.openBlockSettings(block.component);
    let { color, ...settings } = block.settings;
    settings = Object.keys(settings).length
      ? settings
      : this.currentComponent.settings;
    this.pageSv.setBlockSettingsSubject.next({ sender: 'block', settings });
    this.subToBlockSettings(block, blockContainer);
  }

  private subToBlockSettings(block: Block, blockContainer) {
    this.pageSv.blockSettings$
      .pipe(
        takeUntil(this.pageSv.onCloseAuxOutlet$),
        filter(
          (settingsData) =>
            !!settingsData && settingsData.sender === 'settingsForm'
        )
      )
      .subscribe(async (settingsData: SettingsData) => {
        await this.applySettings(block, blockContainer, settingsData.settings);
      });
  }

  onCloseAuxOutlet() {
    /** cancel preview mode and back to design mode */
    this.pageSv.onCloseAuxOutlet$.subscribe((_) => {
      this.pageSv.emit(new SalPageEvent(SalPageEventName.SET_VIEW_MODE, false));
      //this.pageSv.setPreviewModeSubject.next(false)
    });
  }

  async applySettings(block: Block, blockContainer, settings: any) {
    const newBlock = { ...block, settings };
    blockContainer.remove(0);
    this.currentComponent = await this.createContent(newBlock, blockContainer);
    this.data = { ...newBlock };
    setTimeout(() => {
      this.pageSv.applyStyle(
        this.data.styleList,
        this.blockDiv.children.item(1) as HTMLElement
      );
    }, 0);
    this.pageSv.updatePageContent(this.data);
  }

  get blockDiv() {
    return (this.blockContainer.element.nativeElement as HTMLDivElement)
      .parentElement;
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

  deleteBlock() {
    this.pageSv.emit({
      name: SalPageEventName.delete_block,
      value: this.data.id,
    });
  }
}
