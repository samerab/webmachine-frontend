import { RoutingService } from './../../../core/services/routing.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidenavItem } from '@ws-sal';
import { WebsitesTemplatesBrowserComponent } from '../websites-templates-browser/websites-templates-browser.component';
import { UserDashboardService } from '../user-dashboard.service';

@Component({
  selector: 'ws-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  tplComponent: WebsitesTemplatesBrowserComponent;

  sidenavList: SidenavItem[] = [
    {
      id: 'WebsitesTab',
      title: 'Websites',
      icon: 'web',
      children: [
        { id: 'addWebsite', title: 'Add Website', icon: 'add' },
        { id: 'samer', title: 'Website name here: samer', icon: 'wysiwyg' },
        {
          id: 'samer',
          title: 'Website name here: samer name here: sa',
          icon: 'wysiwyg',
        },
      ],
    },
  ];
  websitesDataList;
  idToOpen = of('add');

  constructor(
    private routingSv: RoutingService,
    private userDashboardSv: UserDashboardService
  ) {}

  ngOnInit(): void {
    this.websitesDataList = this.getWebsites();
    //this.setWebsiteNames(this.websitesDataList.map(w => w))
  }

  ngAfterViewInit() {}

  subToRoute(componentRef) {
    if (componentRef instanceof WebsitesTemplatesBrowserComponent) {
      componentRef.onSelect.subscribe((id) => this.openWebsiteCreation(id));
    }
  }

  openWebsiteCreation(id: string) {
    this.routingSv.navigate('createWebsite');
    this.userDashboardSv.websiteTemplateId$.next(id);
  }

  setWebsiteNames(names) {
    this.sidenavList = [
      {
        id: 'w',
        title: 'Websites',
        icon: 'web',
        children: names.map((item) => {
          return {
            id: item['id'],
            title: item['name'],
            icon: 'add',
          };
        }),
      },
      {
        id: 'flat',
        title: 'no children',
        icon: 'web',
      },
    ];
  }

  getWebsites() {
    return [
      { id: 'add', name: 'Add Website' },
      { id: 'w222', name: 'w2' },
    ];
  }

  onNavigate(id: string) {
    if (id === 'addWebsite') {
      this.routingSv.navigate('webiteTemplates');
    } else {
      this.routingSv.navigate('editWebsite');
    }
  }
}
