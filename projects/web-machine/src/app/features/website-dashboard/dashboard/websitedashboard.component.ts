import { Component, OnInit } from '@angular/core';
import { SidenavItem } from '@ws-sal';
import { RoutingService } from '../../../core/services/routing.service';
import { Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { loadFiles } from '@ws-store/file/file.actions';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { loadGridTemplates } from '@ws-store/grid-template/grid-template.actions';
import { loadPageTemplates } from '@ws-store/page-template/page-template.actions';
import { of } from 'rxjs';

@Component({
  selector: 'app-websitedashboard',
  templateUrl: './websitedashboard.component.html',
  styleUrls: ['./websitedashboard.component.scss'],
})
export class WebsitedashboardComponent implements OnInit {
  idToOpen = of('pages');
  sidenavList: SidenavItem[] = [
    {
      id: 'pages',
      title: 'pages',
      icon: 'web',
    },
  ];
  constructor(
    private routingSv: RoutingService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities() {
    this.store.dispatch(loadFiles());
    this.store.dispatch(loadFixedGrids());
    this.store.dispatch(loadGridTemplates());
    this.store.dispatch(loadPageTemplates());
  }

  onNavigate(id: string) {
    switch (id) {
      case 'pages':
        this.routingSv.navigate('pages');
        break;

      default:
        break;
    }
  }
}
