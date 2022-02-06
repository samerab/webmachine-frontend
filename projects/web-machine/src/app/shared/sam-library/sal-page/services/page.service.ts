import { Grid, Block, Style } from '../page.model';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Section } from '../page.model';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { SalFile } from '@ws-sal';
import { CustomEventService } from '../../sal-common/custom.event.service';

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
  defaultRowHeight = 'auto';
  isPreviewMode = true;
  editable = false;
  isEditingMode = false;

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

  constructor(
    rendererFactory: RendererFactory2,
    private router: Router,
    private event: CustomEventService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setPreviewMode(value: boolean) {
    if (this.editable) {
      this.event.emit({
        name: 'preview_mode',
        value,
      });
    }
  }

  setEditingMode(value: boolean) {
    this.isEditingMode = value;
  }

  onPreviewMode$() {
    return this.event
      .on('preview_mode')
      .pipe(tap((status) => (this.isPreviewMode = status)));
  }

  openStyleBuilder() {
    this.router.navigate([{ outlets: { style: 'style' } }]);
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

  editStyle(data: Block | Section, host: HTMLElement): Observable<any> {
    this.setPreviewMode(true);
    this.setEditingMode(true);
    this.openStyleBuilder();
    this.sendStyleListToStyleBuilder(data.styleList);
    return this.event.on('styleListFromStyleBuilder').pipe(
      filter((styleData) => !!styleData),
      takeUntil(this.onCloseAuxOutlet$),
      tap((styleList) => {
        this.handleStyle(data, styleList, host);
      }),
      map((styleList) => styleList)
    );
  }

  sendStyleListToStyleBuilder(value) {
    this.event.emit({
      name: 'styleList',
      value,
    });
  }

  cancelSubject: Subject<null> = new Subject<null>();

  handleStyle(
    oldData: Block | Section | Grid,
    newStyleList: Style[],
    element: HTMLElement
  ) {
    this.removeStyle(element);
    this.applyStyle(newStyleList, element);
    this.saveStyle(oldData, newStyleList);
  }

  applyStyle(styleList: Style[], element: HTMLElement) {
    const css = this.getCssObject(styleList);
    if (css) {
      for (const [key, value] of Object.entries(css)) {
        this.renderer.setStyle(element, key, this.combineStyleParts(value));
      }
    }
  }

  removeStyle(element: HTMLElement) {
    this.renderer.removeAttribute(element, 'style');
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

  getModifiedBlockToAdd(blockToAdd: Block, property: string, val: any) {
    // const copySettings = { ...blockToAdd.settings, [property]: val };
    // const copyBlock = { ...blockToAdd, settings: copySettings };
    // const copyBlockToAdd = { ...blockToAdd, block: copyBlock };
    // return copyBlockToAdd;
    return blockToAdd;
  }
}
