import { Component, OnInit } from '@angular/core';
import { Grid } from '@ws-sal';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { endLoading, startLoading } from '@ws-store/common/common.actions';
import { MessageType, PopupService } from '@ws-sal';
import { BackendResponse } from '../../../core/services/create-effect.service';
import { loadFixedGrids } from '@ws-store/fixed-grid/fixed-grid.actions';
import { allFixedGrids } from '@ws-store/fixed-grid/fixed-grid.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  fixedGridList$;
  gridList: Grid[] = [];
  pageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private apiSv: ApiService,
    private router: Router,
    private popupSv: PopupService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadFixedGrids();
    this.fixedGridList$ = this.store.pipe(select(allFixedGrids));
  }

  loadFixedGrids() {
    this.store.dispatch(loadFixedGrids());
  }

  get page$() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (id?.startsWith('homepage-')) {
          this.location.replaceState('homepage');
        }
        this.store.dispatch(startLoading());
        return this.apiSv.loadOne('pages', id);
      }),
      map((response) => (response as BackendResponse)?.data),
      filter((page) => !!page),
      tap((page) => {
        console.log('page', page);
        this.store.dispatch(endLoading());
        if (!page) {
          this.router.navigate(['page-not-found']);
        }
      }),
      catchError((err) => {
        this.store.dispatch(endLoading());
        this.popupSv.showMsg({
          message: err.error.message,
          type: MessageType.Error,
        });
        return of(null);
      })
    );
  }
}
