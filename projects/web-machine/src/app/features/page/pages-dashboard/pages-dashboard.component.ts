import {
  deletePage,
  deletePages,
  loadPages,
} from '@ws-store/page/page.actions';
import { AppState } from '@ws-store/index';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  ClickedNavbarItem,
  ContextMenuComponent,
  NavbarItem,
  PopupService,
  Page,
} from '@ws-sal';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { END_LIST, START_LIST } from './pages-dashboard.data';
import { allPages } from '@ws-store/page/page.selectors';
import { map, tap } from 'rxjs/operators';
import { RoutingService } from '../../../core/services/routing.service';
import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';

const CONTEXT_MENU = ['button.edit', 'button.delete'];

@Component({
  selector: 'ws-pages-dashboard',
  templateUrl: './pages-dashboard.component.html',
  styleUrls: ['./pages-dashboard.component.scss'],
})
export class PagesDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('contextMenu') contextMenuComponent: ContextMenuComponent;
  @ViewChild(CdkPortal)
  private portal: CdkPortal;

  contextMenu$: Observable<any> = of(CONTEXT_MENU);
  currentPage;
  pages$: Observable<Page[]>;
  startList: NavbarItem[] = START_LIST;
  endList: NavbarItem[] = END_LIST;
  showSelectionSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  selectedPages: any[];
  private host: DomPortalOutlet;
  sub: Subscription = new Subscription();
  test1() {
    console.log('tam');
  }
  constructor(
    private popupSv: PopupService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private routingSv: RoutingService,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.loadPages();
    this.setPages();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadPages() {
    this.sub.add(
      this.selectPages().subscribe((pages) => {
        console.log('pages', pages);
        if (pages?.length === 0) {
          this.store.dispatch(loadPages());
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.setHost();
  }

  setHost() {
    this.host = new DomPortalOutlet(
      document.querySelector('.table-external-guest'),
      this.cfr,
      this.appRef,
      this.injector
    );
    this.host.attach(this.portal);
  }

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

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'delete':
        this.deletePages();
        break;
      case 'add':
        this.addPage();
        break;
    }
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
    const yes = await this.popupSv.showDeleteDialog();
    if (yes) {
      this.store.dispatch(
        deletePages({ ids: this.selectedPages.map((page) => page.id) })
      );
    }
  }

  addPage() {
    this.routingSv.navigate('addPage');
  }

  onContextMenuItemClick(contextMenuId: string) {
    const id = this.currentPage.id;
    switch (contextMenuId) {
      case 'button.edit':
        this.routingSv.navigate('editPage', id);
        //this.store.dispatch(setCurrentPage({page: this.currentPage}))
        break;
      case 'button.delete':
        this.store.dispatch(deletePage({ id }));
        break;
    }
  }

  onPageClick(page: Page) {
    this.routingSv.navigate('editPage', page.id);
  }
}
