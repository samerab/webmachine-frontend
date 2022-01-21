import { AppState } from '@ws-store/index';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RoutingService } from './../../../core/services/routing.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { LOGGED } from '../../../core/services/user.service';
import { setCurrentPlanId } from '@ws-store/common/common.actions';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  plans$: Observable<any[]>

  constructor(
    private routingSv: RoutingService,
    private api: ApiService,
    private store: Store<AppState>,
    @Inject(LOGGED) private logged$
  ) { }

  ngOnInit() {
    this.setPlans();
  }



  private setPlans() {
    const res = this.api.loadAsset('plans');
    this.plans$ = res
      .pipe(
        map(res => {
          return this.getCleanPlans(res);
        }));
  }

  private getCleanPlans(res: unknown): any[] {
    return (<any>res['data'])
      .map(plan => {
        // const { id, ...obj } = plan;
        // return obj;
        return plan
      });
  }

  onSelect(id: string) {
    this.logged$.pipe(take(1)).subscribe(loggedIn => {
      this.store.dispatch(setCurrentPlanId({ id }))
      if (loggedIn) {
        this.routingSv.navigate('home')
      } else {
        this.routingSv.navigate('signup')
      }
    })
  }

}
