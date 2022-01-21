import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserDashboardService } from '../user-dashboard.service';
import { filter, take } from 'rxjs/operators';
import { WebsiteTemplate } from '../websites-templates-browser/websites-templates-browser.component';
import { Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { addWebsite } from '@ws-store/website/website.actions';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-website-crud',
  templateUrl: './website-crud.component.html',
  styleUrls: ['./website-crud.component.scss'],
})
export class WebsiteCrudComponent implements OnInit {
  form: FormGroup;
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

  constructor(
    private userDashboardSv: UserDashboardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.watchTemplateChange();
    this.setTemplateId();
    this.route.data
      .pipe(filter((data) => !!data))
      .subscribe((data) => (this.status = data['status']));
  }

  initForm() {
    this.form = this.fb.group({
      subdomain: ['', [Validators.required]],
      name: ['', [Validators.required]],
      template: ['', [Validators.required]],
    });
  }

  createWebsite() {
    if (this.form.valid) {
      const id = uuid();
      const website = { id, ...this.form.value };
      this.store.dispatch(addWebsite({ website }));
    }
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
}
