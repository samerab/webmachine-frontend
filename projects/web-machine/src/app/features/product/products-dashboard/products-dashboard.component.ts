import { Product } from '@ws-store/product/product.model';
import { AppState } from '@ws-store/index';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ClickedNavbarItem, ContextMenuComponent, NavbarItem, PopupService } from '@ws-sal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { END_LIST, START_LIST } from './products-dashboard.data';
import { deleteProduct, deleteProducts, loadProducts } from '@ws-store/product/product.actions';
import { allProducts } from '@ws-store/product/product.selectors';

const CONTEXT_MENU = ['button.edit', 'button.delete'];

@Component({
  selector: 'ws-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.scss']
})
export class ProductsDashboardComponent implements OnInit {

  @ViewChild('contextMenu') contextMenuComponent: ContextMenuComponent;

  contextMenu$: Observable<any> = of(CONTEXT_MENU);
  products$: Observable<Product[]>;
  startList: NavbarItem[] = START_LIST;
  endList: NavbarItem[] = END_LIST;
  showSelectionSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedItems: any[];
  selectedItem;
  currentItem;

  constructor(
    private popupSv: PopupService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
    this.setProducts();
  }

  private setProducts() {
    this.products$ = this.store
    .pipe(
      select(allProducts),
      );
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'delete':
        this.deleteMany();
        break;
        case 'add':
        this.addOne();
        break;
    }
  }

  onSelect(selectedItem) {
    this.selectedItem = selectedItem;
  }

  onActionClick(data) {
    this.contextMenuComponent.openMenu(data.event);
    this.currentItem = data.row;
  }

  async deleteMany() {
    if (!this.selectedItems || this.selectedItems.length === 0) {
      this.showSelectionSubject$.next(true);
      return;
    }
    const yes = await this.popupSv.showDeleteDialog();
    if (yes) {
      this.store.dispatch(deleteProducts({ids: this.selectedItems.map(item => item.id)}))
    }
  }

  addOne() {
    this.router.navigate(['dashboard/products/add']);
  }

  onContextMenuItemClick(contextMenuId: string) {
    const id = this.currentItem.id;
    switch (contextMenuId) {
      case 'edit':
        this.router.navigate(['dashboard/products/edit', id]);
        break;
      case 'delete':
        this.store.dispatch(deleteProduct({id}))
        break;
    }
  }

  onItemClick(product: Product) {
    this.router.navigate(['dashboard/products/edit', product.id]);
  }


}
