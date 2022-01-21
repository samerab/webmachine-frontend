import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product } from '@ws-store/product/product.model';
import { BehaviorSubject, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from '../../../core/services/env/env.service';
import { switchMap } from 'rxjs/operators';
import { getProductById } from '@ws-store/product/product.selectors';

@Component({
  selector: 'ws-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.scss']
})
export class ProductCrudComponent implements OnInit {

  info$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  slug: FormControl = new FormControl('');
  modifiedItem: Product;
  slugs = [];
  status;
  isSlugChanged = false;
  
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private window: Window,
    private envSv: EnvService,
  ) { }

  ngOnInit(): void {
  }

  get product$() {
    return this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          this.status = id ? 'edit' : 'add';
          if (this.status === 'edit') {
            return this.store.pipe(select(getProductById(id)));
          }
          return of(null);
        })
      )
  }


}
