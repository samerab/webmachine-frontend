import { PopupService } from '../../../sal-popup/popup-service/popup.service';
import { MenuItem } from '../../../sal-menu/models';
import {
  Section,
  Block,
  BlockToAdd,
  Grid,
  GridToUpdate,
  Page,
  PageInfo,
} from '../../page.model';
import { GridComponent } from '../grid/grid.component';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
  TemplateRef,
  ContentChild,
  AfterContentInit,
  Input,
} from '@angular/core';
import { ADD_GRID_MENU, END_LIST, START_LIST } from './page.data';
import { filter } from 'rxjs/operators';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { v4 as uuid } from 'uuid';
import { GridService } from '../grid/grid.service';
import { PageService } from '../../services/page.service';
import { ContentService } from '../../services/content.service';
import {
  ClickedNavbarItem,
  NavbarItem,
  PageInfoSubject,
} from '../../../sal-menu/models';
import { MatDialogRef } from '@angular/material/dialog';
import { ResultsPopupComponent } from '../../../sal-popup/resultsPopup/resultsPopup.component';
import {
  EventService,
  SalEventName,
  SalAction,
  SalActionName,
} from '../../../sal-common/event.service';
import { SalFile } from '../../../models/modes.index';
import { SalContextMenuComponent } from '../../../sal-context-menu/context-menu.component';
import { CustomEventService } from '../../../sal-common/custom.event.service';
import { FilesBrowser, FILES_BROWSER } from '../../../sal-file/tokens';

const CONTEXT_MENU = ['blank grid', 'button.delete'];

@Component({
  selector: 'sal-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterContentInit
{
  @Input() isViewMode = false;
  @Input() page$: Observable<Page>;
  @Input() fileList$: Observable<SalFile[]> = of([]);
  @Input() fixedGridList$: Observable<Grid[]> = of([]);
  @Input() gridTemplateList$: Observable<Grid[]> = of([]);
  @Input() info$: Observable<any> = of();

  @Output() onSave: EventEmitter<Page> = new EventEmitter<Page>();
  @Output() onRealPreview: EventEmitter<Page> = new EventEmitter<Page>();
  @Output() onAction: EventEmitter<SalAction> = new EventEmitter<SalAction>();

  @Input() editable = false;
  @Output() onPreviewMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('gridListContainer', { read: ViewContainerRef })
  gridListContainer: ViewContainerRef;
  @ViewChild('grid') grid: TemplateRef<void>;

  @ViewChild('fileBrowsertemplate') fileBrowsertemplate: TemplateRef<void>;

  @ContentChild(FILES_BROWSER) filesBrowser: FilesBrowser;

  @ViewChild('contextMenu') contextMenuComponent: SalContextMenuComponent;
  @ViewChild('nameTemplate') nameTemplate: TemplateRef<any>;

  @ContentChild('info') info: PageInfoSubject;

  sub: Subscription = new Subscription();
  gridList: Grid[];
  fixedGridList = [];
  contextMenu$: Observable<any> = of(CONTEXT_MENU);
  addGridMenu$: BehaviorSubject<any> = new BehaviorSubject<any>(ADD_GRID_MENU);
  id: string;
  pageInfo: PageInfo;
  gridListSubject: BehaviorSubject<Grid[]> = new BehaviorSubject<Grid[]>([]);
  disableMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  startList: NavbarItem[] = START_LIST;
  endList: NavbarItem[];
  hideInfo = false;
  isDesignMode = true;
  _isViewMode = false;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;

  constructor(
    private contentSv: ContentService,
    private ref: ChangeDetectorRef,
    private gridSv: GridService,
    public pageSv: PageService,
    private popupSv: PopupService,
    private eventSv: EventService,
    private event: CustomEventService
  ) {
    this.gridList = [];
    this.setAddGridMenuState();
  }

  ngOnInit(): void {
    this.onGridIdToDelete();
    this.onUpdateSection();
    this.onUploadFiles();
    this.onDeleteFiles();
    this.emitFileList();
  }

  ngAfterViewInit() {
    this.contentSv.fileBrowsertemplate = this.fileBrowsertemplate;
    this.subToGridList();
    this.subToGridToUpdate();
    this.subToAddBlock();
    this.handleViewMode();
  }

  ngAfterContentInit() {
    this.contentSv.filesBrowser = this.filesBrowser;
    this.constructPage();
    this.subToAddToTemplates();
    this.sub.add(
      this.info?.pageInfoSubject.subscribe((info) => {
        this.pageInfo = info;
      })
    );
    this.sub.add(
      this.info$?.subscribe((info) => {
        this.pageInfo = info;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private handleViewMode() {
    if (this.editable) {
      this.pageSv.editable = this.editable;
      this.pageSv.setPreviewMode(false);
    }
    this.sub.add(
      this.pageSv.onPreviewMode$().subscribe((status) => {
        this.pageSv.isPreviewMode = status;
        this.onPreviewMode.emit(status);
      })
    );
  }

  // TO DO:
  // merge with setViewModeForEditSettings
  // setViewMode() {
  //   if (this.isViewMode) {
  //     this.hideInfo = true;
  //     /** set preview mode */
  //     this.pageSv.setPreviewModeSubject.next(true);
  //     /** stop all subscriptions on isPreviewMode observable */
  //     this.pageSv.setPreviewModeSubject.next(null);
  //   } else {
  //     this.hideInfo = false;
  //     /** set preview mode */
  //     this.pageSv.setPreviewModeSubject.next(false);
  //   }
  // }

  // private setViewModeForEditSettings() {
  //   this.pageSv.on(SalPageEventName.SET_VIEW_MODE).subscribe((isViewMode) => {
  //     this.isViewMode = isViewMode;
  //     this.hideInfo = isViewMode;
  //     this.pageSv.setPreviewModeSubject.next(isViewMode);
  //     this.runExternalViewMode(isViewMode);
  //   });
  // }

  // stopViewMode() {
  //   this.hideInfo = false;
  //   this.pageSv.setPreviewModeSubject.next(false);
  // }

  // private runExternalViewMode(isViewMode: boolean) {
  //   this.eventSv.on(SalEventName.SET_VIEW_MODE).subscribe((_) =>
  //     this.onAction.emit({
  //       name: SalNormalActionName.SET_VIEW_MODE,
  //       payload: isViewMode,
  //     })
  //   );
  // }

  private emitFileList() {
    this.sub.add(
      this.fileList$?.subscribe((list) => {
        this.pageSv.fileListsubject$.next(list);
      })
    );
  }

  handleFixedGrids(list) {
    this.fixedGridList = list;
    this.fillMenuWithFixedGridList(list);
    this.pageSv.fixedGridListSubject$.next(list);
  }

  constructPage() {
    this.sub.add(
      this.gridTemplateList$?.subscribe((list) =>
        this.pageSv.gridTemplateListSubject$?.next(list)
      )
    );
    this.sub.add(
      combineLatest(this.fixedGridList$, this.page$).subscribe((arr) => {
        const [fGridlist, page] = arr;
        this.handleFixedGrids(fGridlist);
        if (page) {
          this.id = page.id;
          this.gridList = this.getFullContent(page.content);
          this.pageInfo = page.info;
          this.info?.defaultPageInfoSubject.next(this.pageInfo);
          this.update();
        }
      })
    );
  }

  subToAddToTemplates() {
    this.sub.add(
      this.eventSv
        .on(SalEventName.ADD_FIXED_GRID_TEMPLATE)
        .subscribe((data) => this.createFixedGrid(data))
    );
    this.sub.add(
      this.eventSv
        .on(SalEventName.ADD_GRID_TEMPLATE)
        .subscribe((data) => this.createGridTemplage(data))
    );
  }

  createFixedGrid(data) {
    this.createTemplate(data, 'fixedGrid');
  }

  createGridTemplage(data) {
    this.createTemplate(data, 'gridTemplate');
  }

  addToPageTemplages(title) {
    const info = { title };
    const payload = {
      id: uuid(),
      content: this.gridList,
      info,
    };
    this.onAction.emit({
      entity: 'pageTemplate',
      name: SalActionName.ADD_ONE,
      payload,
    });
  }

  createTemplate(data, entity) {
    let grid = this.gridList?.find((grid) => grid.id === data.id);
    if (!grid) return;
    const info =
      entity === 'fixedGrid'
        ? { isFixed: true, title: data?.title }
        : { title: data?.title };
    const payload = {
      id: uuid(),
      content: [grid],
      info,
    };
    const action = { entity, name: SalActionName.ADD_ONE, payload };
    this.onAction.emit(action);
  }

  getFullContent(content: Grid[]) {
    const fullGridList = [];
    for (const grid of content) {
      if (!grid.hasOwnProperty('sectionList')) {
        const fullGrid = this.fixedGridList.find(
          (fGrid) => fGrid.id === grid.id
        );
        fullGridList.push(fullGrid);
      } else {
        fullGridList.push(grid);
      }
    }
    return fullGridList;
  }

  // private onPreview() {
  //   this.sub.add(
  //     this.pageSv.isPreviewMode$.subscribe((isPreview) => {
  //       this.hideInfo = true;
  //       this.changeAddGridMenuState(isPreview);
  //       this.isDesignMode = !isPreview;
  //     })
  //   );
  // }

  private setPreviewMode() {
    this.pageSv.setPreviewMode(true);
    //this.pageSv.setPreviewModeSubject.next(true);
  }

  private showDesignPage() {
    this.hideInfo = true;
    //this.pageSv.setPreviewModeSubject.next(false);
  }
  goToDesignMode() {
    this.pageSv.setPreviewMode(false);
  }

  onUploadFiles() {
    this.sub.add(
      this.eventSv.on(SalEventName.UPLOAD_FILES).subscribe((uploadedFiles) => {
        this.onAction.emit({
          entity: 'file',
          name: SalActionName.UPLOAD_FILES,
          payload: uploadedFiles,
        });
      })
    );
  }

  onDeleteFiles() {
    this.sub.add(
      this.eventSv.on(SalEventName.DELETE_FILES).subscribe((keys) => {
        this.onAction.emit({
          entity: 'file',
          name: SalActionName.DELETE_MANY,
          payload: keys,
        });
      })
    );
  }

  onMenuItemClick(menuItem: MenuItem) {
    if (menuItem.parentId === 'addFixed') {
      this.addGrid(this.fixedGridList.find((grid) => grid.id === menuItem.id));
      this.showDesignPage();
    }
    switch (menuItem.id) {
      case 'addBlank':
        this.addGrid();
        this.showDesignPage();
        break;
    }
  }

  fillMenuWithFixedGridList(fixedGridList: any[]) {
    const menuList: any[] = [...ADD_GRID_MENU.list];
    for (const grid of fixedGridList) {
      menuList.push({
        id: grid?.id,
        label: grid?.settings?.name,
        parentId: 'addFixed',
      });
    }
    const menu = { list: menuList };
    this.addGridMenu$.next(menu);
  }

  setAddGridMenuState() {
    // TO DO later
    const index = END_LIST.findIndex((menu) => menu.id === 'addGrid');
    if (index > -1) {
      END_LIST[index].disabled = this.disableMenuSubject;
    }
    this.endList = END_LIST;
  }

  changeAddGridMenuState(disabled: boolean) {
    this.disableMenuSubject.next(disabled);
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'addGrid':
        break;
      case 'save':
        this.save();
        break;
      case 'createTemplage':
        if (this.gridList?.length) {
          this.openPopup();
        }
        break;
      case 'info':
        this.hideInfo = false;
        this.changeAddGridMenuState(true);
        break;
      case 'preview':
        this.setPreviewMode();
        break;
      case 'realPreview':
        this.onRealPreviewHandler();
        break;
      case 'design':
        this.showDesignPage();
        break;
    }
  }

  openPopup() {
    const config = {
      width: '390px',
      height: '280px',
      position: { top: '200px' },
      hasBackdrop: false,
    };
    this.dialogRef = this.popupSv.openPopup1(this.nameTemplate, '', config);
  }

  onButtonSelect(data: { label: string; value: string }) {
    switch (data.label) {
      case 'save':
        this.addToPageTemplages(data.value);
        this.dialogRef.close();
        break;
      case 'cancel':
        this.dialogRef.close();
        break;
    }
  }

  private onRealPreviewHandler() {
    const page = this.save();
    this.onRealPreview.emit(page);
  }

  save() {
    if (!this.generatePage()) return null;
    const page = this.generatePage().reorganizedPage;
    this.onSave.emit(page);
    this.saveFixedGridsChanges();
    return this.generatePage().fullPage;
  }

  saveFixedGridsChanges() {
    const updateList = [];
    for (const grid of this.gridList) {
      if (grid.isFixed) {
        const { id, ...changes } = grid;
        updateList.push({ id, changes });
      }
    }
    const action = {
      entity: 'fixedGrid',
      name: SalActionName.UPDATE_MANY,
      payload: updateList,
    };
    this.onAction.emit(action);
  }

  generatePage() {
    if (!this.pageInfo?.title) {
      this.popupSv.showErrMsg('Title should be provided');
      return null;
    }
    if (!this.id) {
      this.id = uuid();
      this.pageInfo = { ...this.pageInfo, slug: this.generateSlug() };
    }
    const page: Page = {
      id: this.id,
      info: this.pageInfo,
      content: this.getReorganizedGridList(),
    };
    return {
      fullPage: { ...page, content: this.gridList },
      reorganizedPage: page,
    };
  }

  getReorganizedGridList() {
    const newList = [];
    for (const grid of this.gridList) {
      if (grid.isFixed) {
        newList.push({ id: grid.id });
      } else {
        newList.push(grid);
      }
    }
    return newList;
  }

  generateSlug() {
    const slug = this.pageInfo?.title.replace(/ /g, '-');
    return slug;
  }

  onContextMenuItemClick(contextMenuId: string) {}

  private subToAddBlock() {
    this.sub.add(
      this.event.on('updateGridListWithNewBlock').subscribe((block) => {
        const sectionId = block.sectionId;
        const targetGridIndex = this.getTargetGridIndex(sectionId);
        const targetSectionIndex = this.getTargetSectionIndex(sectionId);
        if (targetGridIndex !== -1 && targetSectionIndex !== -1) {
          block = this.pageSv.getModifiedBlockToAdd(
            block,
            'color',
            this.gridList[targetGridIndex].settings.color
          );
          this.addBlock(block, targetGridIndex, targetSectionIndex);
        }
      })
    );
  }

  private addBlock(
    block: Block,
    concernedGridIndex: number,
    concernedSectionIndex: number
  ) {
    const gridListCopy = [...this.gridList];
    this.pushBlock(
      gridListCopy,
      concernedGridIndex,
      concernedSectionIndex,
      block
    );
    this.gridList = [...gridListCopy];
  }

  pushBlock(
    gridListCopy,
    concernedGridIndex,
    concernedSectionIndex,
    finalBlock
  ) {
    const sectionListCopy = [...gridListCopy[concernedGridIndex].sectionList];
    sectionListCopy[concernedSectionIndex] = {
      ...sectionListCopy[concernedSectionIndex],
      blockList: [
        ...sectionListCopy[concernedSectionIndex].blockList,
        finalBlock,
      ],
    };
    gridListCopy[concernedGridIndex] = {
      ...gridListCopy[concernedGridIndex],
      sectionList: sectionListCopy,
    };
  }

  private onUpdateSection() {
    this.sub.add(
      this.pageSv.dataToUpdate$.subscribe((data) => {
        if (data.hasOwnProperty('blockList')) {
          this.updateSection(data as Section);
        } else if (data.hasOwnProperty('component')) {
          this.updateBlock(data as Block);
        }
      })
    );
  }

  updateSection(section: Section) {
    const gridIndex = this.getTargetGridIndex(section.id);
    const sectionIndex = this.getTargetSectionIndex(section.id);
    const secList = [...this.gridList[gridIndex]?.sectionList];
    secList[sectionIndex] = { ...section };
    const grid = { ...this.gridList[gridIndex] };
    grid.sectionList = [...secList];
    const gList = [...this.gridList];
    gList[gridIndex] = { ...grid };
    this.gridList = [...gList];
  }

  updateBlock(block: Block) {
    const gIndex = this.getGridIndexByBlockId(block.id);
    const grid = this.gridList[gIndex];
    if (!grid) return;
    const sIndex = this.getSectionIndexByBlockId(block.id, grid.sectionList);
    let section = grid.sectionList[sIndex];
    const blockIndex = section.blockList
      .map((block) => block.id)
      .indexOf(block.id);
    if (blockIndex > -1) {
      const blockList = [...section.blockList];
      blockList.splice(blockIndex, 1, block);
      const sec = { ...section };
      sec.blockList = [...blockList];
      section = { ...sec };
      this.updateSection(section);
    }
  }

  subToGridList() {
    this.sub.add(
      this.gridListSubject
        .pipe(filter((list) => !!list))
        .subscribe((gridList) => {
          this.gridListContainer.clear();
          if (gridList.length) {
            this.createContent(gridList, this.gridListContainer);
            this.ref.detectChanges();
          }
        })
    );
  }

  private subToGridToUpdate() {
    this.sub.add(
      this.pageSv.gridToUpdate$.subscribe((gridToUpdate) => {
        this.updateGrid(gridToUpdate);
      })
    );
  }

  updateGrid(gridToUpdate: GridToUpdate) {
    const index = this.getIndexInGridList(gridToUpdate.id);
    if (index === -1) return;
    const id = gridToUpdate.id;
    let sectionList;
    let settings;
    let styleList;
    const targetGrid = this.gridList[index];
    if (gridToUpdate.settings) {
      let populatedSectionList = this.gridSv.getPopulatedSectionList(
        targetGrid.sectionList,
        gridToUpdate.settings
      );
      sectionList = this.getModifiedGridWithSectionIds(populatedSectionList);
      settings = gridToUpdate.settings;
      styleList = targetGrid.styleList;
    } else if (gridToUpdate.styleList) {
      sectionList = targetGrid.sectionList;
      settings = targetGrid.settings;
      styleList = gridToUpdate.styleList;
    }
    const grid = {
      id,
      sectionList,
      styleList,
      settings,
    };
    this.assignGrid(grid, index);
    this.contentSv.insertComponent(
      index,
      this.gridListContainer,
      GridComponent,
      grid
    );
    this.gridListContainer.remove(index + 1);
  }

  updateFixedGridSettings(id, settings) {
    const index = this.getIndexInGridList(id);
    if (index === -1) return;
    const targetGrid = this.gridList[index];
    const grid = { ...targetGrid, settings };
    this.assignGrid(grid, index);
    this.contentSv.insertComponent(
      index,
      this.gridListContainer,
      GridComponent,
      grid
    );
    this.gridListContainer.remove(index + 1);
  }

  /*
    > Hier we add ids to the sections
  */
  private getModifiedGridWithSectionIds(sectionList: Section[]) {
    if (!sectionList?.length) return null;
    let finalSectionList = [];
    for (const section of sectionList) {
      const finalSection = { ...section, id: uuid() };
      finalSectionList.push(finalSection);
    }
    return finalSectionList;
  }

  addGrid(grid?: Grid) {
    if (!grid) {
      grid = this.genetateDefaultGrid();
    }
    this.pushGrid(grid);
    this.contentSv.createComponent(this.gridListContainer, GridComponent, grid);
  }

  private onGridIdToDelete() {
    this.sub.add(
      this.pageSv.gridIdToDelete$.subscribe((id) => {
        this.deleteGrid(id);
      })
    );
  }

  deleteGrid(id: string) {
    const index = this.getIndexInGridList(id);
    if (index === -1) return;
    const gridListCopy = this.gridList.slice();
    gridListCopy.splice(index, 1);
    this.gridList = [...gridListCopy];
    this.gridListContainer.remove(index);
  }

  colors = ['red', 'green', 'blue'];

  private genetateDefaultGrid() {
    const gridId: string = uuid();
    let i = this.gridList.length;
    if (i >= this.colors.length) {
      i = Math.floor(Math.random() * this.colors.length);
    }
    const color: string = this.colors[i];
    return {
      id: gridId,
      sectionList: [
        {
          id: uuid(),
          blockList: [],
          settings: {
            color,
          },
        },
      ],
      css: {
        'grid-template-columns': '1fr',
        'grid-template-rows': this.pageSv.defaultRowHeight,
      },
      settings: {
        name: 'grid-' + gridId.substr(0, 3),
        color,
        columns: 1,
        rows: 1,
        columnWidthArray: [{ width: '1fr' }],
        rowHeightArray: [{ height: this.pageSv.defaultRowHeight }],
      },
    };
  }

  private pushGrid(grid: Grid) {
    const gridListCopy = this.gridList.slice();
    gridListCopy.push(grid);
    this.gridList = [...gridListCopy];
  }

  private assignGrid(grid: Grid, index: number) {
    const gridListCopy = this.gridList.slice();
    gridListCopy[index] = grid;
    this.gridList = [...gridListCopy];
  }

  getIndexInGridList(id: string) {
    const ids = this.gridList.map((grid) => grid.id);
    return ids.indexOf(id);
  }

  private getTargetGridIndex(sectionId: string): number {
    const index = this.gridList.findIndex((grid) => {
      return grid.sectionList.map((section) => section.id).includes(sectionId);
    });
    return index;
  }

  private getTargetSectionIndex(sectionId: string) {
    const grid = this.gridList[this.getTargetGridIndex(sectionId)];
    if (!grid) return null;
    const sectionList = grid.sectionList;
    const targetSectionIndex = sectionList
      .map((section) => section.id)
      .indexOf(sectionId);
    return targetSectionIndex;
  }

  getGridIndexByBlockId(blockId: string) {
    return this.gridList.findIndex((grid) =>
      this.isGridHasBlock(grid, blockId)
    );
  }

  getSectionIndexByBlockId(blockId: string, sectionList: Section[]) {
    const index = sectionList.findIndex((section) =>
      this.isSectionHasBlock(section, blockId)
    );
    return index;
  }

  isGridHasBlock(grid: Grid, blockId: string) {
    const section = grid.sectionList.find((section) =>
      this.isSectionHasBlock(section, blockId)
    );
    return section ? true : false;
  }

  isSectionHasBlock(section: Section, blockId: string) {
    const ids = section.blockList.map((block) => block.id);
    const bool = ids.includes(blockId);
    return bool;
  }

  private getConcernedSectionIndex(
    concernedGridIndex: number,
    blockToAdd: BlockToAdd
  ) {
    const sectionList = this.gridList[concernedGridIndex].sectionList;
    const concernedSectionIndex = sectionList
      .map((section) => section.id)
      .indexOf(blockToAdd.sectionId);
    return concernedSectionIndex;
  }

  private update() {
    this.gridListSubject.next(this.gridList);
  }

  createContent(gridList: Grid[], container: ViewContainerRef) {
    for (const grid of gridList) {
      this.contentSv.createComponent(container, GridComponent, grid);
    }
  }
}
function FilesBrowser(FilesBrowser: any) {
  throw new Error('Function not implemented.');
}
