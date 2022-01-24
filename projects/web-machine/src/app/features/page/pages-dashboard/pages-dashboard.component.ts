import { deletePage, deletePages } from '@ws-store/page/page.actions';
import { AppState } from '@ws-store/index';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ContextMenuComponent, PopupService, Page } from '@ws-sal';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { allPages } from '@ws-store/page/page.selectors';
import { map } from 'rxjs/operators';
import { RoutingService } from '../../../core/services/routing.service';

@Component({
  selector: 'ws-pages-dashboard',
  templateUrl: './pages-dashboard.component.html',
  styleUrls: ['./pages-dashboard.component.scss'],
})
export class PagesDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('contextMenu') contextMenuComponent: ContextMenuComponent;
  currentPage;
  pages$: Observable<Page[]>;
  showSelectionSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  selectedPages: any[];
  sub: Subscription = new Subscription();
  homepageId: string;

  constructor(
    private popupSv: PopupService,
    private store: Store<AppState>,
    private routingSv: RoutingService
  ) {}

  ngOnInit(): void {
    //this.loadPages();
    this.setPages();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // private loadPages() {
  //   this.sub.add(
  //     this.selectPages().subscribe((pages) => {
  //       if (pages?.length === 0) {
  //         this.store.dispatch(loadPages());
  //       }
  //     })
  //   );
  // }

  ngAfterViewInit(): void {}

  selectPages() {
    return this.store.pipe(select(allPages));
  }

  private setPages() {
    this.pages$ = this.selectPages().pipe(
      map((pages) =>
        pages.map((page) => {
          return { ...page, title: page?.info?.title };
        })
      )
    );
  }

  onSelect(selectedPages) {
    this.selectedPages = selectedPages;
  }

  onActionClick(data) {
    this.contextMenuComponent.openMenu(data.event);
    this.currentPage = data.row;
  }

  async deletePages() {
    if (!this.selectedPages || this.selectedPages.length === 0) {
      this.showSelectionSubject$.next(true);
      return;
    }
    this.sub.add(
      this.popupSv
        .verifyDeleteDialog((_) => {
          this.store.dispatch(
            deletePages({ ids: this.selectedPages.map((page) => page.id) })
          );
        })
        .subscribe()
    );
  }

  deletePage() {
    this.sub.add(
      this.popupSv
        .verifyDeleteDialog((_) => {
          const id = this.currentPage.id;
          this.store.dispatch(deletePage({ id }));
        })
        .subscribe()
    );
  }

  editPage() {
    const id = this.currentPage.id;
    this.routingSv.navigate('editPage', id);
  }

  addPage() {
    this.routingSv.navigate('addPage');
  }

  onPageClick(page: Page) {
    this.routingSv.navigate('editPage', page.id);
  }
}
