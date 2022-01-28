import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarItem } from '@ws-sal';
import { RoutingService } from '../../../core/services/routing.service';
import { Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { loadFiles } from '@ws-store/file/file.actions';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { loadGridTemplates } from '@ws-store/grid-template/grid-template.actions';
import { loadPageTemplates } from '@ws-store/page-template/page-template.actions';
import { of, Subscription } from 'rxjs';
import { loadPages } from '@ws-store/page/page.actions';
import { homepageId } from '@ws-store/page/page.selectors';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-websitedashboard',
  templateUrl: './websitedashboard.component.html',
  styleUrls: ['./websitedashboard.component.scss'],
})
export class WebsitedashboardComponent implements OnInit, OnDestroy {
  idToOpen = of('pages');
  sub: Subscription = new Subscription();
  homepageId: string;
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
    private userSv: UserService
  ) {
    this.userSv.refreshUser();
  }

  ngOnInit(): void {
    this.loadEntities();
    this.setHomepageId();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadEntities() {
    this.store.dispatch(loadFiles());
    this.store.dispatch(loadFixedGrids());
    this.store.dispatch(loadGridTemplates());
    this.store.dispatch(loadPageTemplates());
    this.store.dispatch(loadPages());
  }

  setHomepageId() {
    this.sub.add(
      this.store.select(homepageId).subscribe((id) => (this.homepageId = id))
    );
  }

  onNavigate(id: string) {
    switch (id) {
      case 'pages':
        this.routingSv.navigate('pages');
        break;
      case 'homepage':
        this.routingSv.navigate('editPage', this.homepageId);
        break;
      default:
        break;
    }
  }
}
