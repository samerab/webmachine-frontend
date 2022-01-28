import { Grid, StyleData, Block, SettingsData, Style } from '../page.model';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Section, BlockToAdd } from '../page.model';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SalFile } from '@ws-sal';

export class SalPageEvent {
  constructor(public name: SalPageEventName, public value: any) {}
}

export enum SalPageEventName {
  UNSUBSCRIBE = 'unsubscribe',
  SET_VIEW_MODE = 'setViewMode',
  delete_block = 'deleteBlock',
}

@Injectable({
  providedIn: 'root',
})
export class PageService {
  defaultRowHeight = '500px';
  isWaitingForStyle;

  setViewModeSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isViewMode$ = this.setViewModeSubject.asObservable();

  setPreviewModeSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(2);
  isPreviewMode$ = this.setPreviewModeSubject.asObservable();

  setGridIdToDeleteSubject: Subject<string> = new Subject<string>();
  gridIdToDelete$ = this.setGridIdToDeleteSubject.asObservable();

  updateDataSubject: Subject<Block | Section | Grid> = new Subject<
    Block | Section | Grid
  >();
  dataToUpdate$ = this.updateDataSubject.asObservable();

  updateGridSubject: Subject<any> = new Subject<any>();
  gridToUpdate$ = this.updateGridSubject.asObservable();

  addBlockSubject: Subject<any> = new Subject<any>();
  blockToAdd$ = this.addBlockSubject.asObservable();

  setStyleSubject: Subject<StyleData> = new Subject<StyleData>();
  style$ = this.setStyleSubject.asObservable();

  setSavedStyleSubject: BehaviorSubject<StyleData> =
    new BehaviorSubject<StyleData>(null);
  savedStyle$ = this.setSavedStyleSubject.asObservable();

  setBlockSettingsSubject: BehaviorSubject<SettingsData> =
    new BehaviorSubject<SettingsData>(null);
  blockSettings$ = this.setBlockSettingsSubject.asObservable();

  stopWatchingStyleSubject: Subject<Section> = new Subject<Section>();
  stopWatchingStyle$ = this.stopWatchingStyleSubject.asObservable();

  closeAuxOutletSubject: Subject<Section> = new Subject<Section>();
  onCloseAuxOutlet$ = this.closeAuxOutletSubject.asObservable();

  fileListsubject$: BehaviorSubject<SalFile[]> = new BehaviorSubject<SalFile[]>(
    null
  );
  fixedGridListSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  gridTemplateListSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  subject$: BehaviorSubject<SalPageEvent> = new BehaviorSubject<SalPageEvent>(
    null
  );

  emit(event: SalPageEvent) {
    this.subject$.next(event);
  }

  on(name: SalPageEventName) {
    return this.subject$.pipe(
      filter((event: SalPageEvent) => event?.name === name),
      map((event) => event.value)
    );
  }

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private router: Router) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showPrevieMode() {
    this.emit(new SalPageEvent(SalPageEventName.SET_VIEW_MODE, true));
  }

  openStyleBuilder() {
    this.router.navigate([{ outlets: { style: 'style' } }]);
  }

  openBlockSettings(blockName: string) {
    this.router.navigate([
      { outlets: { blockSettings: `block-settings/${blockName}` } },
    ]);
  }

  openx() {
    this.router.navigate([
      { outlets: { templates: `templates/grid-templates` } },
    ]);
  }

  combineStyleParts(obj) {
    if (!obj) return;
    if (obj.option && obj.color) {
      return `${obj.value}${obj.unit} ${obj.option} ${obj.color}`;
    }
    if (Object.keys(obj).length === 1 && obj.color) {
      return `${obj.color}`;
    }
    if (Object.keys(obj).length === 1 && obj.option) {
      return `${obj.option}`;
    }
    if (Object.keys(obj).length === 1 && obj.value) {
      return `${obj.value}`;
    }
    if (Object.keys(obj).length === 2 && obj.option) {
      if (obj.value) {
        return `${obj.value}`;
      }
      return `${obj.option}`;
    }
    if (typeof obj === 'string') {
      return obj;
    }
    return obj.value + obj.unit;
  }

  editStyle(data: Block | Section | Grid, element: HTMLElement) {
    this.openStyleBuilder();
    this.setSavedStyleSubject.next({
      sender: 'consumer',
      styleList: data.styleList,
    });
    //this.isWaitingForStyle = true;
    this.subToStyle(data, element);
  }

  // private subToStyle(data: Block | Section | Grid, element: HTMLElement) {
  //   this.style$
  //     .pipe(
  //       takeWhile(_ => this.isWaitingForStyle),
  //       filter(styleData => !!styleData && styleData.sender === 'builder')
  //     )
  //     .subscribe((styleData: StyleData) => {
  //       this.handleStyle(data, styleData.styleList, element);
  //       this.isWaitingForStyle = false;
  //     });
  // }

  cancelSubject: Subject<null> = new Subject<null>();
  // private subToStyle(data: Block | Section | Grid, element: HTMLElement) {
  //   this.style$
  //     .pipe(
  //       takeWhile(_ => this.isWaitingForStyle),
  //       filter(styleData => !!styleData && styleData.sender === 'builder')
  //     )
  //     .subscribe((styleData: StyleData) => {
  //       this.handleStyle(data, styleData.styleList, element);
  //       this.isWaitingForStyle = false;
  //       this.setStyleSubject.next(null);
  //     });
  // }

  private subToStyle(data: Block | Section | Grid, element: HTMLElement) {
    this.style$
      .pipe(
        filter((styleData) => !!styleData),
        takeUntil(this.onCloseAuxOutlet$)
      )
      .subscribe((styleData: StyleData) => {
        this.handleStyle(data, styleData.styleList, element);
      });
  }

  handleStyle(
    data: Block | Section | Grid,
    styleList: Style[],
    element: HTMLElement
  ) {
    this.removeStyle(data.styleList, element);
    this.applyStyle(styleList, element);
    this.saveStyle(data, styleList);
  }

  applyStyle(styleList: Style[], element: HTMLElement) {
    const css = this.getCssObject(styleList);
    if (css) {
      for (const [key, value] of Object.entries(css)) {
        this.renderer.setStyle(element, key, this.combineStyleParts(value));
      }
    }
  }

  removeStyle(styleList: Style[], element: HTMLElement) {
    const css = this.getCssObject(styleList);
    if (css) {
      for (const key of Object.keys(css)) {
        this.renderer.removeStyle(element, key);
      }
    }
  }

  saveStyle(data: Block | Section | Grid, styleList: Style[]) {
    const dataCopy = { ...data };
    dataCopy.styleList = styleList;
    this.updatePageContent(dataCopy);
  }

  updatePageContent(data: Block | Section | Grid) {
    this.updateDataSubject.next(data);
  }

  getCssObject(styleList: Style[]) {
    if (!styleList) return null;
    const stylesArr = styleList.map((styleConfig) => styleConfig.value);
    let cssObj = {};
    for (const style of stylesArr) {
      cssObj = { ...cssObj, ...style };
    }
    return cssObj;
  }

  getSectionIndexByBlockId(blockId: string, sectionList: Section[]) {
    return sectionList.findIndex((section) =>
      this.isSectionHasBlock(section, blockId)
    );
  }

  isSectionHasBlock(section: Section, blockId: string) {
    return section.blockList.map((block) => block.id).includes(blockId);
  }

  getModifiedBlockToAdd(blockToAdd: BlockToAdd, property: string, val: any) {
    const copySettings = { ...blockToAdd.block.settings, [property]: val };
    const copyBlock = { ...blockToAdd.block, settings: copySettings };
    const copyBlockToAdd = { ...blockToAdd, block: copyBlock };
    return copyBlockToAdd;
  }
}
