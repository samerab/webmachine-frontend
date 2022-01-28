import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PageService } from '../../../services/page.service';
import { GridSettings, Cell, MergeInfo } from '../../../page.model';

@Component({
  selector: 'ws-grid-design',
  templateUrl: './grid-design.component.html',
  styleUrls: ['./grid-design.component.scss'],
})
export class GridDesignComponent implements OnInit, OnDestroy {
  @Input() settings: GridSettings;
  @Output() onDesignChange: EventEmitter<any> = new EventEmitter<any>();
  removeMergeSubject: Subject<any> = new Subject<any>();
  panelOpenState = false;
  form: FormGroup;
  cellsCount = 0;
  cellList: Cell[] = [];
  cellsDiv;
  layout;
  mergeInfoList: MergeInfo[];

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    private pageSv: PageService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.cellsDiv = this.document.getElementById('cells');
    this.setForm();
    this.onFormChange();
    this.onColumnsChange();
    this.onRowsChange();
    this.onColumnsWidthChange();
    this.onRowsHeightChange();
  }

  ngOnDestroy() {}

  buildForm() {
    this.form = this.fb.group({
      columns: 1,
      rows: 1,
      columnWidthArray: this.fb.array([]),
      rowHeightArray: this.fb.array([]),
      name: 'grid',
    });
  }

  get rows() {
    return +this.form.get('rows').value;
  }
  get cols() {
    return +this.form.get('columns').value;
  }

  get columnWidthFormArray() {
    return this.form.get('columnWidthArray') as FormArray;
  }

  get columnWidthControls() {
    return this.columnWidthFormArray.controls;
  }

  get rowHeightFormArray() {
    return this.form.get('rowHeightArray') as FormArray;
  }

  get rowHeightControls() {
    return this.rowHeightFormArray.controls;
  }

  setForm() {
    if (!this.settings) return;
    this.setColumnWidthArray();
    this.setRowHeightArray();
    this.form.get('columns').setValue(this.settings.columns);
    this.form.get('rows').setValue(this.settings.rows);
    this.form.get('name').setValue(this.settings.name);
    this.cellsCount = this.rows * this.cols;
    this.popCellList();
    this.setColumnsStyle();
    this.setRowsStyle();
    this.mergeInfoList = this.settings.mergeInfoList;
  }

  private setRowHeightArray() {
    if (this.settings.rowHeightArray.length) {
      for (const group of this.settings.rowHeightArray) {
        const formGroup = this.fb.group(group);
        this.rowHeightFormArray.push(formGroup);
      }
    }
  }

  private setColumnWidthArray() {
    if (this.settings.columnWidthArray.length) {
      for (const group of this.settings.columnWidthArray) {
        const formGroup = this.fb.group(group);
        this.columnWidthFormArray.push(formGroup);
      }
    }
  }

  popCellList() {
    this.cellList.splice(0);
    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.cols; col++) {
        this.cellList.push({ row, col });
      }
    }
  }

  private onFormChange() {
    this.form.valueChanges.subscribe((val) => {
      // TO DO: check form validation and reset columns and rows to 1
      this.emit();
    });
  }

  private onRowsChange() {
    this.form.get('rows').valueChanges.subscribe((n) => {
      this.removeMerge();
      const rowsVal = +n;
      this.cellsCount = rowsVal * this.cols;
      this.popCellList();
      this.generateRowHeightArray(rowsVal);
      //this.setStyle(rowsVal, 'rows');
      this.setRowsStyle();
      //this.emit();
    });
  }

  private onColumnsChange() {
    this.form
      .get('columns')
      .valueChanges.pipe(filter((n) => !!n)) //// TO DO: check form validation and reset columns and rows to 1
      .subscribe((n) => {
        this.removeMerge();
        const columnsVal = +n;
        this.cellsCount = columnsVal * this.rows;
        this.popCellList();
        this.generateColumnWidthArray(columnsVal);
        //this.setStyle(columnsVal, 'columns');
        this.setColumnsStyle();

        //this.emit();
      });
  }

  removeMerge() {
    this.mergeInfoList = null;
    this.removeMergeSubject.next(null);
  }

  onMerge(mergeInfoList: MergeInfo[]) {
    this.mergeInfoList = mergeInfoList;
    if (mergeInfoList) {
      // const mergedCellsCount = mergeInfoList.map(mi => mi.mergedCellsCount).reduce((a, b) => a + b, 0)
      // this.cellsCount = this.cellsCount - mergedCellsCount + 1;
      this.cellsCount = mergeInfoList.length;
    }
    this.emit();
  }

  emit() {
    setTimeout(() => {
      const settings: GridSettings = {
        ...this.form.value,
        sectionsCount: this.cellsCount,
        layout: this.layout,
        color: null,
        mergeInfoList: this.mergeInfoList,
      };
      this.onDesignChange.emit(settings);
    }, 0);
  }
  private onColumnsWidthChange() {
    this.form.get('columnWidthArray').valueChanges.subscribe((n) => {
      this.setColumnsStyle();
      //this.emit();
    });
  }

  private onRowsHeightChange() {
    this.form.get('rowHeightArray').valueChanges.subscribe((n) => {
      this.setRowsStyle();
      this.setRowsStyleForPreviewGrid();
      //this.emit();
      //this.onDesignChange.emit({ ...this.form.value, cellsCount: this.cellsCount, css: this.layout });
    });
  }

  // private setStyle(n: any, target: string) {
  //   if (!this.cellsDiv) return;
  //   if (target === 'rows') {
  //     this.renderer.setStyle(this.cellsDiv, 'grid-template-rows', `repeat(${n}, 1fr)`);
  //   }
  //   else if (target === 'columns') {
  //     this.setColumnsStyle();
  //     //this.renderer.setStyle(cellsDiv, 'grid-template-columns', `repeat(${n}, 1fr)`);
  //   }
  // }

  setRowsStyle() {
    //if (!this.cellsDiv) return;
    const gridTemplateRows = this.form
      .get('rowHeightArray')
      .value.map((r) => {
        if (!r.height || r.height === '') {
          return this.pageSv.defaultRowHeight;
        }
        return r.height;
      })
      .join(' ');
    //this.renderer.setStyle(this.cellsDiv, 'grid-template-rows', gridTemplateRows);
    this.layout = { ...this.layout, 'grid-template-rows': gridTemplateRows };
  }

  setRowsStyleForPreviewGrid() {
    if (!this.cellsDiv) return;
    const gridTemplateRows = this.form
      .get('rowHeightArray')
      .value.map((r) => {
        if (
          !r.height ||
          r.height === '' ||
          r.height === 'auto' ||
          r.height < '100px'
        ) {
          return this.pageSv.defaultRowHeight;
        }
        return r.height;
      })
      .join(' ');
    this.renderer.setStyle(
      this.cellsDiv,
      'grid-template-rows',
      gridTemplateRows
    );
  }

  setColumnsStyle() {
    if (!this.cellsDiv) return;
    const gridTemplateColumns = this.form
      .get('columnWidthArray')
      .value.map((c) => {
        if (!c.width || c.width === '') {
          return '1fr';
        }
        return c.width;
      })
      .join(' ');
    this.renderer.setStyle(
      this.cellsDiv,
      'grid-template-columns',
      gridTemplateColumns
    );
    this.layout = {
      ...this.layout,
      'grid-template-columns': gridTemplateColumns,
    };
  }

  generateColumnWidthArray(n: number) {
    this.columnWidthFormArray.clear();
    for (let index = 0; index < n; index++) {
      const formGroup = this.fb.group({ width: '' });
      this.columnWidthFormArray.push(formGroup);
    }
  }

  generateRowHeightArray(n: number) {
    this.rowHeightFormArray.clear();
    for (let index = 0; index < n; index++) {
      const formGroup = this.fb.group({ height: this.pageSv.defaultRowHeight });
      this.rowHeightFormArray.push(formGroup);
    }
  }
}
