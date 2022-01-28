import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDashboardService } from '../user-dashboard.service';
import { filter, switchMap, take } from 'rxjs/operators';
import { WebsiteTemplate } from '../websites-templates-browser/websites-templates-browser.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { addWebsite } from '@ws-store/website/website.actions';
import { v4 as uuid } from 'uuid';
import { getwebsite } from '@ws-store/website/website.selectors';
import { RoutingService } from '../../../core/services/routing.service';
import { Subscription } from 'rxjs';
import { EnvService } from '../../../core/services/env/env.service';
import { Website } from '@ws-store/website/website.model';

@Component({
  selector: 'app-website-crud',
  templateUrl: './website-crud.component.html',
  styleUrls: ['./website-crud.component.scss'],
})
export class WebsiteCrudComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub: Subscription = new Subscription();
  websiteTemplates: WebsiteTemplate[] = [
    {
      id: '1',
      imgSrc:
        'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg',
    },
    {
      id: '2',
      imgSrc:
        'https://colorlib.com/wp/wp-content/uploads/sites/2/featured_electrician-website-templates.jpg',
    },
    {
      id: '3',
      imgSrc:
        'https://themefisher.com/wp-content/uploads/2018/10/biztrox-hugo-premium-theme.jpg',
    },
  ];
  currentTemplate: WebsiteTemplate;
  status = '';
  currentWebsite: Website;

  constructor(
    private userDashboardSv: UserDashboardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private routingSv: RoutingService,
    private envSv: EnvService,
    private window: Window
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setStatus();
    this.watchTemplateChange();
    this.setTemplateId();
    if (this.status === 'edit') {
      this.fillForm();
    }
  }

  fillForm() {
    this.sub.add(
      this.route.params
        .pipe(
          switchMap((params) => {
            const id = params['id'];
            return this.store.select(getwebsite(id));
          })
        )
        .subscribe((website) => {
          this.currentWebsite = website;
          this.form.patchValue(website);
        })
    );
  }

  private setStatus() {
    this.route.data
      .pipe(filter((data) => !!data))
      .subscribe((data) => (this.status = data['status']));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm() {
    this.form = this.fb.group({
      subdomain: ['', [Validators.required]],
      name: ['', [Validators.required]],
      template: ['', [Validators.required]],
    });
  }

  getlastAdded(id) {
    return this.store.pipe(select(getwebsite(id)));
  }

  createWebsite() {
    if (this.form.valid) {
      const id = uuid();
      const website = { id, ...this.form.value };
      this.store.dispatch(addWebsite({ website }));
      this.onAddSuccess(id);
    }
  }

  private onAddSuccess(id: string) {
    this.sub.add(
      this.getlastAdded(id).subscribe((last) => {
        if (last) {
          this.userDashboardSv.addHomepage(last);
          this.routingSv.navigate('websiteList');
        }
      })
    );
  }

  private watchTemplateChange() {
    this.form
      .get('template')
      .valueChanges.subscribe((id) => this.setCurrentTemplate(id));
  }

  private setCurrentTemplate(id: string) {
    this.currentTemplate = this.websiteTemplates.find((tpl) => tpl.id === id);
  }

  private setTemplateId() {
    this.userDashboardSv.websiteTemplateId$
      .pipe(
        filter((id) => !!id),
        take(1)
      )
      .subscribe((id) => this.form.get('template').setValue(id));
  }

  openWebsiteDashboard() {
    this.userDashboardSv.openWebsiteDashboard(this.currentWebsite.id);
    // let mainDomain = this.envSv.mainDomain;
    // if ((mainDomain = 'http://localhost:3000')) {
    //   mainDomain = 'http://localhost:4200';
    // }
    // const id = this.currentWebsite.id;
    // const url = `${mainDomain}/website/redirect/${id}`;
    // this.window.open(url);
  }
}
