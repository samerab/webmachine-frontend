import { allGridTemplates } from '@ws-store/grid-template/grid-template.selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { endLoading, startLoading } from '@ws-store/common/common.actions';
import { allPageTemplates } from '@ws-store/page-template/page-template.selectors';
import { allFixedGrids } from '@ws-store/fixed-grid/fixed-grid.selectors';
import { ActionService } from '../../../core/services/action.service';
import { SalAction, SalActionName } from '@ws-sal';

@Component({
  selector: 'ws-templates-browser',
  templateUrl: './templates-browser.component.html',
  styleUrls: ['./templates-browser.component.scss']
})
export class TemplatesBrowserComponent implements OnInit, OnDestroy {

  list$: BehaviorSubject<any> = new BehaviorSubject([])
  sub: Subscription = new Subscription();
  stopFixedGrids: Subject<any> = new Subject<any>();
  stopGridTemplates: Subject<any> = new Subject<any>();
  stopPageTemplates: Subject<any> = new Subject<any>();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private actionSv: ActionService
  ) { }

  ngOnInit(): void {
    this.sub.add(
      this.data
        .subscribe(template => {
          this.list$.next(template)
        })
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get data() {
    let id;
    return this.route.paramMap
      .pipe(
        switchMap(params => {
          this.store.dispatch(startLoading());
          id = params.get('id');
          return this.getObservable(id)
        }),
        map(list => {
          /** change plural to sigular | remove s from the end | pageTemplates => pageTemplate **/
          const type = id.slice(0, id.length - 1);
          return { type, list }
        }),
        tap(_ => this.store.dispatch(endLoading()))
      )
  }

  // get data() {
  //   return this.route.paramMap
  //     .pipe(
  //       switchMap(params => {
  //         this.store.dispatch(startLoading());
  //         const id = params.get('id');
  //         return this.getObservable(id);
  //       }),
  //       tap(_ => this.store.dispatch(endLoading()))
  //     )
  // }


  private getObservable(id: string) {
    switch (id) {
      case 'pageTemplates':
        return this.store.pipe(
          takeUntil(this.stopPageTemplates),
          select(allPageTemplates),
        );
      case 'gridTemplates':
        return this.store.pipe(
          takeUntil(this.stopGridTemplates),
          select(allGridTemplates),
        );
      case 'fixedGrids':
        return this.store.pipe(
          takeUntil(this.stopFixedGrids),
          select(allFixedGrids),
        );
      default:
        return null
    }
    this.stopObservales()
  }

  stopObservales() {
    this.stopFixedGrids.next(null);
    this.stopGridTemplates.next(null);
    this.stopPageTemplates.next(null);
  }

  onTemplateAction(action: SalAction) {
    if (action.name === SalActionName.EDIT) {
       this.router.navigate([`dashboard/templates/edit/${action.entity}/${action.payload}`])
        return;
    }
    this.actionSv.dispatchAction(action)
  }





}
