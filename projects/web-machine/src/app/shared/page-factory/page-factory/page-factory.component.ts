import { SalNormalActionName } from '@ws-sal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { BehaviorSubject, Observable } from 'rxjs';
import { Grid, Page, SalFile } from '@ws-sal';
import { getAllFiles } from '@ws-store/file/file.selectors';
import { allFixedGrids } from '@ws-store/fixed-grid/fixed-grid.selectors';
import { allGridTemplates } from '@ws-store/grid-template/grid-template.selectors';
import { ActionService } from '../../../core/services/action.service';
import { showMainSidebar } from '@ws-store/common/common.actions';

@Component({
  selector: 'ws-page-factory',
  templateUrl: './page-factory.component.html',
  styleUrls: ['./page-factory.component.scss']
})
export class PageFactoryComponent implements OnInit {

  @Input() page$: Observable<Page>;
  @Input() info$: Observable<Grid[]>;

  @Output() onSave: EventEmitter<Page> = new EventEmitter<Page>();
  @Output() onRealPreview: EventEmitter<Page> = new EventEmitter<Page>();

  fileList$: BehaviorSubject<SalFile[]> = new BehaviorSubject<SalFile[]>(null);
  fixedGridList$: BehaviorSubject<Grid[]> = new BehaviorSubject<Grid[]>(null);
  gridTemplateList$: BehaviorSubject<Grid[]> = new BehaviorSubject<Grid[]>(null);

  constructor(
    private store: Store<AppState>,
    private actionSv: ActionService
  ) { }

  ngOnInit(): void {
    this.emitFileList();
    this.emitFixedGridList();
    this.emitGridTemplateList();

  }

  onRealPreviewEvent(page: Page) {
    this.onRealPreview.emit(page)
  }

  onSaveEvent(page: Page) {
    this.onSave.emit(page)
  }

  emitFileList() {
    this.store.pipe(select(getAllFiles))
      .subscribe(fileList => {
        this.fileList$.next(fileList);
      });
  }

  emitFixedGridList() {
    this.store.pipe(select(allFixedGrids))
      .subscribe(list => {
        this.fixedGridList$.next(list);
      });
  }

  emitGridTemplateList() {
    this.store.pipe(select(allGridTemplates))
      .subscribe(list => {
        this.gridTemplateList$.next(list);
      });
  }

  /** check if enum is non ngrxAction 
   * return true if the action is SalNormalActionName
  */
  checkActionType(action) {
    let arr = [];
    for (const [key, value] of Object.entries(SalNormalActionName)) {
      arr.push(value)
    }
    return arr.includes(action.name)
  }

  onAction(action) {
    if (this.checkActionType(action)) {
      if (action.name === SalNormalActionName.SET_VIEW_MODE) {
        this.store.dispatch(showMainSidebar({bool: !action.payload}))
      }
      return
    }
    this.actionSv.dispatchAction(action)
  }


}
