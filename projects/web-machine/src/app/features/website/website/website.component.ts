import { Component, OnInit } from '@angular/core';
import { Grid } from '@ws-sal';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { endLoading, startLoading } from '@ws-store/common/common.actions';
import { MessageType, PopupService } from '@ws-sal';
import { BackendResponse } from '../../../core/services/create-effect.service';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { allFixedGrids } from '@ws-store/fixed-grid/fixed-grid.selectors';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit {

  fixedGridList$;
  gridList: Grid[] = [];
  pageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private apiSv: ApiService,
    private router: Router,
    private popupSv: PopupService,
  ) { }

  ngOnInit(): void {
    this.loadFixedGrids();
    this.fixedGridList$ = this.store.pipe(select(allFixedGrids))
  }

  loadFixedGrids() {
    this.store.dispatch(loadFixedGrids())
  }

  get page() {
    return this.route.paramMap
      .pipe(
        switchMap(params => {
          this.store.dispatch(startLoading());
          return this.apiSv.loadOne('pages', params.get('id'))
        }),
        map((response) => (response as BackendResponse)?.data),
        tap(page => {
          this.store.dispatch(endLoading());
          if (!page) {
            this.router.navigate(['page-not-found']);
          }
        }),
        catchError((err) => {
          this.store.dispatch(endLoading());
          this.popupSv.showMsg({ message: err.error.message, type: MessageType.Error });
          return of(null);
        })
      )
  }

  // get page() {
  //   return this.route.paramMap
  //     .pipe(
  //       switchMap(params => {
  //         this.store.dispatch(startLoading());
  //         return this.apiSv.loadOne('pages', params.get('id'))
  //       }),
  //       map((response: BackendResponse) => response.data),
  //       tap(page => {
  //         this.store.dispatch(endLoading());
  //         if (!page) {
  //           this.router.navigate(['page-not-found']);
  //         }
  //       }),
  //       catchError((err) => {
  //         this.store.dispatch(endLoading());
  //         this.popupSv.showMsg({ message: err.error.message, type: MessageType.Error });
  //         return of(null);
  //       })
  //     )
  // }

}
