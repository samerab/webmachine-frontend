import { SalEventName } from '../../../sal-common/event.service';
import { GridService } from './grid.service';
import { END_LIST, START_LIST, MENU } from './grid.data';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  TemplateRef,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Grid, GridSettings, Section } from '../../page.model';
import { SectionComponent } from '../section/section.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, takeWhile, delay } from 'rxjs/operators';
import { PageService } from '../../services/page.service';
import { ContentService } from '../../services/content.service';
import { PopupService } from '../../../sal-popup/index';
import { ClickedNavbarItem, MenuItem } from '../../../sal-menu/models';
import { MatDialogRef } from '@angular/material/dialog';
import { ResultsPopupComponent } from '../../../sal-popup/resultsPopup/resultsPopup.component';
import { EventService } from '../../../sal-common/event.service';
import { SidenavItem } from '../../../sal-sidenav/interfaces';
import { GRID_PROVIDERS, SIDEBAR_LIST } from './grid-providers';

@Component({
  selector: 'ws-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [GRID_PROVIDERS],
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sectionListContainer', { read: ViewContainerRef })
  sectionListContainer: ViewContainerRef;
  @ViewChild('designPopupTemplate') designPopupTemplate: TemplateRef<any>;
  @ViewChild('gridNameTemplate') gridNameTemplate: TemplateRef<any>;
  @ViewChild('title') title: ElementRef<HTMLElement>;
  @ViewChild('sectionListDiv') sectionListDiv: ElementRef<HTMLDivElement>;

  data: Grid;
  sectionListSubject: BehaviorSubject<Section[]> = new BehaviorSubject<
    Section[]
  >(null);
  isDesignMode;
  startList = START_LIST;
  endList = END_LIST;
  settings;
  isExpanded = true;
  menu$: BehaviorSubject<any> = new BehaviorSubject<any>(MENU);
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  sub: Subscription = new Subscription();

  constructor(
    private contentSv: ContentService,
    private renderer: Renderer2,
    private host: ElementRef,
    private ref: ChangeDetectorRef,
    private popupSv: PopupService,
    private gridSv: GridService,
    private pageSv: PageService,
    private eventSv: EventService,
    @Inject(SIDEBAR_LIST) public sidenavList: SidenavItem[]
  ) {}

  ngOnInit(): void {
    this.isDesignMode = false;
  }

  ngAfterViewInit() {
    this.setProperties();
    this.createContent(this.data.sectionList, this.sectionListContainer);
    this.subToSectionList();
    this.onPreview();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private onPreview() {
    this.pageSv.isPreviewMode$
      .pipe(
        takeWhile((isPreview) => isPreview !== null),
        delay(0)
      )
      .subscribe((isPreview) => {
        this.setDesignModeStyle(isPreview);
        this.isDesignMode = !isPreview;
        if (isPreview) {
          this.isExpanded = false;
          this.toggleGrid();
        } else {
          setTimeout(() => {
            this.setTitleColor();
          }, 0);
        }
      });
  }

  setDesignModeStyle(isPreview: boolean) {
    if (isPreview) {
      this.renderer.removeClass(this.sectionListDiv.nativeElement, 'coral');
      this.renderer.removeClass(this.host.nativeElement, 'grid');
    } else {
      this.renderer.addClass(this.sectionListDiv.nativeElement, 'coral');
      this.renderer.addClass(this.host.nativeElement, 'grid');
    }
  }

  subToSectionList() {
    this.sectionListSubject
      .pipe(filter((sectionList) => !!sectionList))
      .subscribe((sectionList) => {
        this.sectionListContainer.clear();
        this.createContent(sectionList, this.sectionListContainer);
        //this.handleInitialView(sectionList.length === 0);
        this.ref.detectChanges();
      });
  }

  createContent(sectionList: Section[], container: ViewContainerRef) {
    if (!sectionList?.length) return;
    for (const section of sectionList) {
      this.contentSv.createComponent(container, SectionComponent, section);
    }
  }

  setProperties() {
    this.sectionListSubject.next(this.data.sectionList);
    this.setLayout();
  }

  setLayout() {
    if (this.data.settings.layout) {
      const elem = this.sectionListContainer.element
        .nativeElement as HTMLDivElement;
      for (const [key, value] of Object.entries(this.data.settings.layout)) {
        this.renderer.setStyle(elem.parentElement, key, value);
      }
    }
    this.setTitleColor();
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

  runCommand(id) {
    switch (id) {
      case 'design':
        this.openDesignPopup();
        break;
      case 'toggleGrid':
        this.toggleGrid();
        break;
      case 'createTemplage':
        this.type = 'createTemplage';
        this.openPopup();
        break;
      case 'createFixedGrid':
        this.type = 'createFixedGrid';
        this.openPopup();
        break;
      case 'delete':
        this.deleteGrid();
        break;
    }
  }

  /**
   * Menu Functions
   **/

  type: string;

  onMenuItemClick(menuItem: MenuItem) {
    switch (menuItem.id) {
      case 'toggleGrid':
        this.toggleGrid();
        break;
      case 'createTemplage':
        this.type = 'createTemplage';
        this.openPopup();
        break;
      case 'createFixedGrid':
        this.type = 'createFixedGrid';
        this.openPopup();
        break;
      case 'deleteGrid':
        this.deleteGrid();
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
    this.dialogRef = this.popupSv.openPopup1(this.gridNameTemplate, '', config);
  }

  onButtonSelect(data: { label: string; value: string }) {
    switch (data.label) {
      case 'save':
        if (this.type === 'createTemplage') {
          this.addToGridTemplates(data.value);
        } else {
          this.addToFixedGrids(data.value);
        }
        this.dialogRef.close();
        break;
      case 'cancel':
        this.dialogRef.close();
        break;
    }
  }

  addToFixedGrids(title) {
    this.eventSv.emit({
      name: SalEventName.ADD_FIXED_GRID_TEMPLATE,
      value: { id: this.data.id, title },
    });
  }

  addToGridTemplates(title) {
    this.eventSv.emit({
      name: SalEventName.ADD_GRID_TEMPLATE,
      value: { id: this.data.id, title },
    });
  }

  toggleGrid() {
    this.toggleExpandMenuItem();
    const height = this.isExpanded ? '0' : 'auto';
    this.renderer.setStyle(this.sectionListDiv.nativeElement, 'height', height);
    this.isExpanded = !this.isExpanded;
  }

  private toggleExpandMenuItem() {
    const list = [...MENU.list];
    const index = list.findIndex((item) => item.id === 'toggleGrid');
    if (index > -1) {
      if (!this.isExpanded) {
        list[index] = {
          ...list[index],
          icon: 'expand_less',
          label: 'collapse',
        };
      } else {
        list[index] = { ...list[index], icon: 'expand_more', label: 'expand' };
      }
      const menu = { list };
      this.menu$.next(menu);
    }
  }

  openDesignPopup() {
    this.popupSv.openPopup(this.designPopupTemplate, this.data.settings);
  }

  onDesignChange(settings: GridSettings) {
    settings = { ...settings, color: this.data.settings.color };
    this.updateGrid(this.data.id, settings);
  }

  updateGrid(gridId: string, settings) {
    const gridToUpdate = {
      id: gridId,
      settings,
    };
    this.pageSv.updateGridSubject.next(gridToUpdate);
  }

  deleteGrid() {
    this.sub.add(
      this.popupSv
        .verifyDeleteDialog((_) => {
          this.pageSv.setGridIdToDeleteSubject.next(this.data.id);
        })
        .subscribe()
    );
  }
}
