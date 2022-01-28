import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PopupService, SalContextMenuComponent } from '@ws-sal';
import { AppState } from '@ws-store/index';
import {
  deleteWebsite,
  deleteWebsites,
  loadManyWebsites,
} from '@ws-store/website/website.actions';
import { Website } from '@ws-store/website/website.model';
import { allWebsites } from '@ws-store/website/website.selectors';
import { BehaviorSubject, map, Observable, Subscription, take } from 'rxjs';
import { RoutingService } from '../../../core/services/routing.service';
import { UserDashboardService } from '../user-dashboard.service';

@Component({
  selector: 'app-websiteList',
  templateUrl: './websiteList.component.html',
  styleUrls: ['./websiteList.component.scss'],
})
export class WebsiteListComponent implements OnInit {
  @ViewChild('contextMenu') contextMenuComponent: SalContextMenuComponent;
  currentEntity: Website;
  entities$: Observable<Website[]>;
  showSelectionSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  selectedEntities: any[];
  sub: Subscription = new Subscription();

  constructor(
    private popupSv: PopupService,
    private store: Store<AppState>,
    private routingSv: RoutingService,
    private userDashboardSv: UserDashboardService
  ) {}

  ngOnInit(): void {
    this.loadEntities();
    this.setEntities();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadEntities() {
    this.sub.add(
      this.selectAll()
        .pipe(take(1))
        .subscribe((entities) => {
          if (entities?.length === 0) {
            this.store.dispatch(loadManyWebsites());
          }
        })
    );
  }

  ngAfterViewInit(): void {}

  selectAll() {
    return this.store.pipe(select(allWebsites));
  }

  private setEntities() {
    this.entities$ = this.selectAll();
  }

  onMultiSelect(selectedEntities) {
    this.selectedEntities = selectedEntities;
  }

  onActionClick(data) {
    this.contextMenuComponent.openMenu(data.event);
    this.currentEntity = data.row;
  }

  async deleteEntities() {
    if (!this.selectedEntities || this.selectedEntities.length === 0) {
      return this.showSelectionSubject$.next(true);
    }
    this.sub.add(
      this.popupSv
        .verifyDeleteDialog((_) => {
          this.store.dispatch(
            deleteWebsites({
              ids: this.selectedEntities.map((entity) => entity.id),
            })
          );
        })
        .subscribe()
    );
  }

  deleteEntity() {
    this.sub.add(
      this.popupSv
        .verifyDeleteDialog((_) => {
          const id = this.currentEntity.id;
          this.store.dispatch(deleteWebsite({ id }));
        })
        .subscribe()
    );
  }

  editEntity() {
    const id = this.currentEntity.id;
    this.routingSv.navigate('editWebsite', id);
  }

  addEntity() {
    this.routingSv.navigate('websiteTemplates');
  }

  onRowSelect(entity) {
    this.routingSv.navigate('editWebsite', entity.id);
  }

  openWebsiteDashboard() {
    this.userDashboardSv.openWebsiteDashboard(this.currentEntity.id);
  }
}
