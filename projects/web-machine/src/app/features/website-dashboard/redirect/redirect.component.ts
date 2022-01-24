import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { loadWebsite } from '@ws-store/website/website.actions';
import { getwebsite } from '@ws-store/website/website.selectors';
import { EMPTY, map, Subject, Subscription, switchMap, tap } from 'rxjs';
import { RoutingService } from '../../../core/services/routing.service';

@Component({
  selector: 'ws-redirect',
  template: ``,
  styles: [],
})
export class RedirectComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  subject: Subject<null> = new Subject<null>();
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private routingSv: RoutingService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.route.params
        .pipe(
          switchMap((params) => {
            const id = params['id'];
            if (id) {
              this.store.dispatch(loadWebsite({ id }));
              return this.getwebsite(id);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe((website) => {
          if (website) {
            this.routingSv.navigate('websiteDashboard');
          }
        })
    );
  }

  ngOnInitdfgdf(): void {
    this.sub.add(
      this.subject
        .pipe(
          switchMap((_) => this.route.params),
          switchMap((params) => {
            const id = params['id'];
            if (id) {
              this.store.dispatch(loadWebsite({ id }));
              return this.getwebsite(id);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe((website) => {
          console.log('website', website);
          if (website) {
            this.routingSv.navigate('websiteDashboard');
          } else {
            //this.subject.next(null);
          }
        })
    );
    this.subject.next(null);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getwebsite(id) {
    return this.store.pipe(select(getwebsite(id)));
  }
}
