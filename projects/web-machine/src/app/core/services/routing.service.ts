import { NavigationExtras, Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private routes = [
    { name: 'home', path: '/' },
    { name: 'emailConfirmation', path: 'users/email/confirmation' },
    { name: 'loginUser', path: 'users/login' },
    { name: 'signup', path: 'users/signup' },
    { name: 'usersDashboard', path: 'users/dashboard' },
    { name: 'websiteList', path: 'users/dashboard/websites' },
    { name: 'addWebsite', path: 'users/dashboard/websites/add' },
    { name: 'editWebsite', path: 'users/dashboard/websites/edit' },
    { name: 'websiteTemplates', path: 'users/dashboard/websites/templates' },
    { name: 'loginClient', path: 'website/login' },
    { name: 'websiteDashboard', path: 'website/dashboard' },
    { name: 'pages', path: 'website/dashboard/pages' },
    { name: 'editPage', path: 'website/dashboard/pages/edit' },
    { name: 'addPage', path: 'website/dashboard/pages/add' },
  ];
  constructor(private router: Router) {}

  private getPath(name: string) {
    const route = this.routes.find((route) => route.name === name);
    return route ? route.path : null;
  }

  navigate(routeName: string, ...params) {
    const path = this.getPath(routeName);
    return this.router.navigate([path, ...params]);
  }
}
