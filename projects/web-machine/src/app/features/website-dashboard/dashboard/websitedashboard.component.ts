import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SidebarItem } from '@ws-sal';
import { RoutingService } from '../../../core/services/routing.service';
import { Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { loadFiles } from '@ws-store/file/file.actions';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { loadGridTemplates } from '@ws-store/grid-template/grid-template.actions';
import { loadPageTemplates } from '@ws-store/page-template/page-template.actions';
import { filter, of, Subscription, take, tap } from 'rxjs';
import { loadPages } from '@ws-store/page/page.actions';
import { homepageId } from '@ws-store/page/page.selectors';
import { UserService } from '../../../core/services/user.service';
import { isPreviewMode } from '@ws-store/common/common.selectors';

@Component({
  selector: 'app-websitedashboard',
  templateUrl: './websitedashboard.component.html',
  styleUrls: ['./websitedashboard.component.scss'],
})
export class WebsitedashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashContainer', { static: true })
  dashContainer: ElementRef<HTMLElement>;
  idToOpen = of('homepage');
  sub: Subscription = new Subscription();
  sidebarList: SidebarItem[] = [
    {
      id: 'homepage',
      title: 'Homepage',
      icon: 'home',
    },
    {
      id: 'pages',
      title: 'pages',
      icon: 'web',
    },
  ];
  constructor(
    private routingSv: RoutingService,
    private store: Store<AppState>,
    private userSv: UserService,
    private renderer: Renderer2
  ) {
    this.userSv.refreshUser();
  }

  ngOnInit(): void {
    this.loadEntities();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get isPreviewMode$() {
    return this.store.select(isPreviewMode).pipe(
      tap((isPreviewMode) => {
        if (isPreviewMode) {
          this.renderer.addClass(
            this.dashContainer.nativeElement,
            'no-sidenav'
          );
        } else {
          this.renderer.removeClass(
            this.dashContainer.nativeElement,
            'no-sidenav'
          );
        }
      })
    );
  }

  loadEntities() {
    this.store.dispatch(loadFiles());
    this.store.dispatch(loadFixedGrids());
    this.store.dispatch(loadGridTemplates());
    this.store.dispatch(loadPageTemplates());
    this.store.dispatch(loadPages());
  }

  onNavigate(id: string) {
    switch (id) {
      case 'pages':
        this.routingSv.navigate('pages');
        break;
      case 'homepage':
        this.sub.add(
          this.store
            .select(homepageId)
            .pipe(
              filter((id) => !!id),
              take(1)
            )
            .subscribe((id) => {
              if (id) {
                this.routingSv.navigate('editPage', id);
              }
            })
        );
        break;
      default:
        break;
    }
  }
}
