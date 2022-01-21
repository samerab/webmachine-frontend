import { SalDashboardComponent } from '@ws-sal';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DASHBOARD_SIDEBAR_ITEMS } from './dashboard.data';
import { Store, select } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { loadFiles } from '@ws-store/file/file.actions';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { loadGridTemplates } from '@ws-store/grid-template/grid-template.actions';
import { loadPageTemplates } from '@ws-store/page-template/page-template.actions';
import { mainSidebarIsVisible } from '@ws-store/common/common.selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('dashboard') dashboard: SalDashboardComponent;
  list = [...DASHBOARD_SIDEBAR_ITEMS];

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loadEntities();
  }

  ngAfterViewInit() {
    this.toggleSidbar()
  }

  toggleSidbar() {
    this.store.pipe(select(mainSidebarIsVisible))
    .pipe(
      filter(v => v !== null))
      .subscribe(visible => {
        if (visible) {
          this.dashboard.showSidebar()
        }
        else {
          this.dashboard.hideSidebar()
        }
      })
  }

  loadEntities() {
    this.store.dispatch(loadFiles());
    this.store.dispatch(loadFixedGrids());
    this.store.dispatch(loadGridTemplates());
    this.store.dispatch(loadPageTemplates());
  }


  go() {
    this.router.navigate(['/dashboard/page-generator'])
  }

}
