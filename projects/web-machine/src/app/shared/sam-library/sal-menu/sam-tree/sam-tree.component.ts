import { TreeItem } from '../models';
import { Observable, Subscription, BehaviorSubject, combineLatest, fromEvent } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, OnDestroy, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { NestedTreeControl, CdkTree } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { MenuService } from '../services/menu.service';
import { MenuData } from '../models';
import { LanguageService } from '../../sal-translate/language.service';
import { tap, filter } from 'rxjs/operators';
import { DragDropInfo } from '../models';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'sam-tree',
  templateUrl: './sam-tree.component.html',
  styleUrls: ['./sam-tree.component.scss']
})
export class SamTreeComponent implements OnInit, OnDestroy, AfterViewInit {

  mouseMove$: Observable<MouseEvent>;
  mouseUp$: Observable<MouseEvent>;
  @Input() data: Observable<MenuData>;
  @Input() searchNodeList$: Observable<TreeItem[]>;
  @Output() onNodeClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDrop: EventEmitter<DragDropInfo> = new EventEmitter<DragDropInfo>();
  @ViewChild(CdkTree) tree: CdkTree<any>;
  lang$ = this.langSv.currentLang;
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource;
  dataTree;
  isRightDir: boolean;
  navIcon: string;
  selectedDiv: HTMLDivElement;
  //selectedNode: any;
  hoveredDiv: HTMLDivElement;
  lastHoveredDiv: HTMLDivElement;
  previousHoveredDiv: HTMLDivElement;
  hoveredDivBottom: number;
  hostNode;
  guestNode;
  difference: number;
  action: string;
  //isMouseDown = false;
  isMouseDownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  classHover: string;
  searchResultDivs: HTMLDivElement[] = [];

  originalMenuList; // to delete later

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  sub: Subscription = new Subscription();

  constructor(
    private menuSv: MenuService,
    private renderer: Renderer2,
    private langSv: LanguageService,
    private hostElement: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {
    this.mouseMove$ = fromEvent(hostElement.nativeElement, 'mousemove');
    this.mouseUp$ = fromEvent(hostElement.nativeElement, 'mouseup');
  }

  ngOnInit(): void {
    this.subscribeToData();
    this.setDirection();
    this.subscribeToMouseMove();
    this.subscribeToMouseDown();
    this.subscribeToMouseUp();
    this.subToSearch();
  }

  private subToSearch() {
    this.searchNodeList$
      .pipe(
        tap(_ => {
          this.removeSearchResultStyle();
          this.collapseAll();
        }),
        filter(nodeList => !!nodeList)
      )
      .subscribe(nodeList => {
        const ids = nodeList.map(node => node.id);
        let categoryList = nodeList.map(node => node.category);
        const categorySet = new Set(categoryList);
        const netCategoryList = [...categorySet];
        const heads = netCategoryList.map(cat => {
          const head = this.dataTree.find(nodeList => nodeList.id === cat);
          if (head) return head;
        })
        this.expand(heads);
        this.setSearchResultDivs(ids);

      });
    }
    
    setSearchResultDivs(ids: string[]) {
      this.searchResultDivs = [];
      for (const [i, id] of ids.entries()) {
        this.searchResultDivs.push(this.document.getElementById(id));
        if (this.searchResultDivs[i]) {
          this.renderer.addClass(this.searchResultDivs[i], 'search-result');
        }
      }
  }

  removeSearchResultStyle() {
    if (!this.searchResultDivs || this.searchResultDivs.length === 0) return;
    for (const div of this.searchResultDivs) {
      this.renderer.removeClass(div, 'search-result')
    }
  }

  ngAfterViewInit() { }

  subscribeToMouseMove() {
    this.sub.add(
      combineLatest(this.mouseMove$, this.isMouseDownSubject)
        .subscribe(arr => {
          const [e, isMouseDown] = arr;
          if (isMouseDown) {
            this.difference = this.hoveredDivBottom - e.clientY;
            this.onMouseMove();
          }
        })
    );
  }

  subscribeToMouseDown() {
    this.sub.add(
      this.isMouseDownSubject
        .subscribe(isMouseDown => {
          this.classHover = isMouseDown ? 'drag-hover' : 'hover';
        })
    );
  }

  subscribeToMouseUp() {
    this.sub.add(
      this.mouseUp$
        .subscribe(_ => {
          this.renderer.removeClass(this.hoveredDiv, 'drag-hover');
          this.renderer.removeClass(this.lastHoveredDiv, 'drag-hover');
        })
    );
  }

  // subscribeToMouseMove() {
  //   this.sub.add(
  //     this.mouseMove$
  //       .subscribe(e => {
  //         if (this.isMouseDown) {
  //           this.difference = this.hoveredDivBottom - e.clientY;
  //           this.onMouseMove();
  //         }
  //       })
  //   );
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  subscribeToData() {
    this.sub.add(
      this.data.subscribe(menuData => {
        this.originalMenuList = menuData.list; // to delete later
        this.setDatasource(menuData);
      })
    );
  }

  private setDatasource(menuData: MenuData) {
    const tree = this.menuSv.getFamilyTree(menuData.list, { rootToStartFrom: menuData.rootToStartFrom, onlyParents: menuData.onlyParents });
    this.dataTree = tree;
    this.dataSource = new ArrayDataSource(tree);
  }

  getNavIcon(isRightDir: boolean, node) {
    return this.treeControl.isExpanded(node)
      ? "expand_more"
      : `chevron_${isRightDir ? 'left' : 'right'}`
  }

  setDirection() {
    this.sub.add(this.langSv.currentLang.pipe(
      tap(lang => this.isRightDir = lang === 'ar')
    ).subscribe())
  }

  send(node, div) {
    this.removeSelectStyle();
    this.setSelectedDiv(div);
    //this.selectedNode = node;
    this.addSelectStyle(div);
    this.onNodeClick.emit(node);
  }

  private setSelectedDiv(div: any) {
    this.selectedDiv = div;
  }

  private addSelectStyle(div: HTMLDivElement) {
    this.renderer.addClass(div, 'active');
  }

  private removeSelectStyle() {
    if (this.selectedDiv) {
      this.renderer.removeClass(this.selectedDiv, 'active');
    }
  }

  onDragStarted(node) {
    this.guestNode = node;
    // this.isMouseDown = true;
    this.isMouseDownSubject.next(true);
  }

  private setHoveredDiv(div: HTMLDivElement) {
    this.lastHoveredDiv = this.hoveredDiv;
    this.hoveredDiv = div;
  }

  // addStyle(element, classToAdd: any[], classToRemove: any[]) {
  //   this.renderer.addClass(element, classToAdd);
  //   this.renderer.removeClass(element, classToRemove);
  // }

  addStyle(element, classToAdd, classToRemove) {
    this.renderer.addClass(element, classToAdd);
    this.renderer.removeClass(element, classToRemove);
  }

  private addHoverStyle(div: HTMLDivElement) {
    this.renderer.addClass(div, this.classHover);
    //this.addStyle(div, 'hover', 'selection')
    //this.renderer.setStyle(div, 'background', 'red');
  }

  private removeHoverStyle() {
    if (this.hoveredDiv) {
      this.renderer.removeClass(this.hoveredDiv, this.classHover);
      //this.renderer.setStyle(this.hoveredDiv, 'background', 'white');
      //this.addStyle(this.hoveredDiv, 'deselection', 'hover')
      //this.renderer.addClass(this.hoveredDiv, 'deselection');
    }
  }

  private restoreSelectStyle(div: HTMLDivElement) {
    if (this.selectedDiv === div) {
      this.addSelectStyle(div);
    }
  }

  onMouseMove() {
    if (this.difference > 17 && this.difference <= 42) {
      this.removeHoverStyle();
      this.renderer.setStyle(this.hoveredDiv, 'borderTop', '2px solid red');
      this.action = 'insert';
    }
    else {
      this.renderer.setStyle(this.hoveredDiv, 'borderTop', 'none');
      this.addHoverStyle(this.hoveredDiv);
      this.action = 'nest';
    }
  }

  onMouseOver(node, div: HTMLDivElement) {
    this.hoveredDivBottom = div.getBoundingClientRect().bottom;
    this.removeHoverStyle();
    this.setHoveredDiv(div);
    this.addHoverStyle(div);
    this.hostNode = node;
  }

  onMouseLeave(div) {
    this.renderer.setStyle(div, 'borderTop', 'none');
    this.previousHoveredDiv = div;
    this.removeHoverStyle();
    if (this.selectedDiv) {
      this.restoreSelectStyle(this.selectedDiv);
    }
  }

  drop() {
    //this.isMouseDown = false;
    this.isMouseDownSubject.next(false);
    this.onDrop.emit({
      hostNode: this.hostNode,
      guestNode: this.guestNode,
      action: this.action
    });
  }

  reset() {
    this.collapseAll();
    if (this.selectedDiv) {
      this.renderer.setStyle(this.selectedDiv, 'background', 'white')
      this.selectedDiv = null;
    }
  }

  expand(nodes) {
    for (const node of nodes) {
      this.tree?.treeControl.expandDescendants(node);
    }
  }

  collapseAll() {
    this.tree?.treeControl.collapseAll()
  }

  expandAll() {
    this.treeControl.dataNodes = this.tree.dataSource['_data'];
    this.treeControl.expandAll()
  }

}
