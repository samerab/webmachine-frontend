import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wrongSubdomain') wrongSubdomain: TemplateRef<any>;
  @ViewChild('unregisteredDomain') unregisteredDomain: TemplateRef<any>;
  @ViewChild('notFound') notFound: TemplateRef<any>;

  template: TemplateRef<any>;
  context;
  sub: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sub.add(
      this.route.queryParams.subscribe((params) => {
        if (params?.hasOwnProperty('wrong-subdomain')) {
          this.template = this.wrongSubdomain;
          this.context = { subdomain: params['wrong-subdomain'] };
        } else if (params?.hasOwnProperty('unregistered-domain')) {
          this.template = this.unregisteredDomain;
          this.context = { domain: params['unregistered-domain'] };
        } else {
          this.template = this.notFound;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
