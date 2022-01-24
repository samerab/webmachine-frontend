import { RoutingService } from './../../../core/services/routing.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WebsitesTemplatesBrowserComponent } from '../websites-templates-browser/websites-templates-browser.component';
import { UserDashboardService } from '../user-dashboard.service';

@Component({
  selector: 'ws-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  tplComponent: WebsitesTemplatesBrowserComponent;
  currentSelect;

  constructor(
    private routingSv: RoutingService,
    private userDashboardSv: UserDashboardService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  openWebsiteList() {
    this.routingSv.navigate('websiteList');
  }

  subToRoute(componentRef) {
    if (componentRef instanceof WebsitesTemplatesBrowserComponent) {
      componentRef.onSelect.subscribe((id) => this.openWebsiteCreation(id));
    }
  }

  openWebsiteCreation(id: string) {
    this.routingSv.navigate('addWebsite');
    this.userDashboardSv.websiteTemplateId$.next(id);
  }
}
