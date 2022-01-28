import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Website } from '@ws-store/website/website.model';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EnvService } from '../../core/services/env/env.service';
import { WINDOW } from '../../core/services/tokens';

@Injectable({
  providedIn: 'root',
})
export class UserDashboardService {
  websiteTemplateId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(
    private apiSv: ApiService,
    private envSv: EnvService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  addHomepage(website: Website) {
    if (website) {
      const id = `homepage-${website.subdomain}`;
      const slug = id;
      const websiteId = website.id;
      this.apiSv.post('assets/homepage', { id, slug, websiteId }).subscribe();
    }
  }

  openWebsiteDashboard(id: string) {
    let mainDomain = this.envSv.mainDomain;
    if ((mainDomain = 'http://localhost:3000')) {
      mainDomain = 'http://localhost:4200';
    }
    const url = `${mainDomain}/website/redirect/${id}`;
    this.window.open(url);
  }

  addCookie() {
    this.document.cookie = 'is_user=true;';
  }
}
