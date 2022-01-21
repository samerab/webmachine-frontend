import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageInfoSubject, Page } from '@ws-sal';
import { AppState } from '@ws-store/index';

@Component({
  selector: 'ws-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.scss']
})
export class PageInfoComponent implements OnInit, PageInfoSubject {

  pageInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  defaultPageInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  form: FormGroup;

  @Input() page$: Observable<Page>;
  @Output() onInfo: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.onFormChange();
    this.setDefault();
    
  }

  // private setDefault() {
  //   this.defaultPageInfoSubject.subscribe(info => {
  //     if (info) {
  //       this.form.setValue(info);
  //     }
  //   });
  // }

  private setDefault() {
    this.page$.subscribe((page: Page) => {
      if (page) {
        this.form.setValue(page.info);
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      title: '',
      description: '',
      slug: '',
    });
  }

  onFormChange() {
    this.form.valueChanges
    .subscribe(val => {
      /**
       * send data to sal-page.
       * We subscribe to pageInfoSubject in sal-page where we get to in through : 
       * @ContentChild('info') info: PageInfoSubject;
       * every info component(page-info, product-info, post-info...) should implement PageInfoSubject
       */
      this.pageInfoSubject.next(val)
      this.onInfo.emit(val)
    });
  }

}
