import { Observable, of, Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { SidenavItem } from '../interfaces';
import { MatAccordion } from '@angular/material/expansion';

interface ItemIds {
  id: string;
  elemId: string;
  parentElemId?: string;
}

@Component({
  selector: 'sal-sidenav',
  templateUrl: './sal-sidenav.component.html',
  styleUrls: ['./sal-sidenav.component.scss'],
})
export class SalSidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() list: SidenavItem[];
  @Input() panelClass: string;
  /** used to hide text and show only icon */
  @Input() hasTitle = true;
  @Input() hasDivider = true;
  @Input() lineHeight = '65px';
  @Input() activeClass = '';
  @Input() childrenBg = '#ffffff';
  /** default item to open on init */
  @Input() idToOpen: Observable<string> = of('');

  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChildren('child') children: QueryList<ElementRef>;
  @ViewChildren('childrenArea') childrenArea: QueryList<ElementRef>;

  currentIndex = '';
  sub: Subscription = new Subscription();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setItemHeight();
    this.setChildrenAreaBg();
    this.openItem();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getHeadersIds() {
    const ids = [];
    this.accordion._headers.forEach((h) => {
      ids.push(h.panel._headerId);
    });
    return ids;
  }

  private openItem() {
    setTimeout(() => {
      this.sub.add(
        this.idToOpen.subscribe((id) => {
          const elem = this.getItemsIds().find((item) => item.id === id);
          if (elem) {
            if (elem.parentElemId) {
              const domElem = document.getElementById(elem.parentElemId);
              domElem.click();
            }
            const domElem = document.getElementById(elem.elemId);
            domElem.click();
          }
        })
      );
    }, 0);
  }

  private setChildrenAreaBg() {
    this.childrenArea.forEach((area) => {
      this.renderer.setStyle(
        area.nativeElement,
        'backgroundColor',
        this.childrenBg
      );
    });
  }

  private setItemHeight() {
    this.children.forEach((child) => {
      this.renderer.setStyle(child.nativeElement, 'height', this.lineHeight);
    });
  }

  getItemsIds(): ItemIds[] {
    const headersIds = this.getHeadersIds();
    const ids = [];
    if (this.list) {
      for (const [parentIndex, item] of this.list.entries()) {
        ids.push({
          id: item.id,
          elemId: headersIds[parentIndex],
        });
        if (item.children) {
          for (const [childIndex, child] of item.children.entries()) {
            ids.push({
              id: child.id,
              elemId: this.getId(parentIndex, childIndex),
              parentElemId: headersIds[parentIndex],
            });
          }
        }
      }
    }
    return ids;
  }

  onItemSelect(
    item: SidenavItem,
    parentIndex: number,
    childIndex: number,
    isChild?: boolean
  ) {
    if (!item.children) {
      /** if the item is title and not child of title */
      if (!isChild) {
        this.accordion.closeAll();
      }
      this.currentIndex = parentIndex.toString() + childIndex.toString();
      this.onSelect.emit(item.id);
    }
  }

  getActiveClasses(parentIndex: number, childIndex: number): string[] {
    const c1 = this.isActive(parentIndex, childIndex) ? this.activeClass : '';
    return [c1];
  }

  isActive(parentIndex: number, childIndex: number) {
    const index = parentIndex.toString() + childIndex.toString();
    return index === this.currentIndex;
  }

  getId(parentIndex: number, childIndex: number) {
    const index = parentIndex.toString() + childIndex.toString();
    return index;
  }
}
