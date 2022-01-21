import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatRow, MatTable } from '@angular/material/table';
import { Subscription, BehaviorSubject, fromEvent } from 'rxjs';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'sal-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public set data(value: any[]) {
    if (!value) value = [];
    this.dataSource = new MatTableDataSource(value);
    this.dataCount = value.length - 1;
    this.selection = new SelectionModel<any[]>(true, []);
  }
  @Input() columns: string[] = [];
  @Input() hasFilter = true;
  @Input() hasSelection$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  @Input() hasAction = false;
  @Input() hasPaginator = false;
  @Input() noData = 'No data matching the filter';

  @Output() rowSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable, { static: true }) tab!: MatTable<any>;
  @ViewChild(MatRow, { static: true }) row!: MatRow;
  @ViewChildren('row') rows!: QueryList<ElementRef>;
  @ViewChild('container', { static: true }) container!: ElementRef;

  selection: SelectionModel<any[]>;
  appearance: MatFormFieldAppearance = 'outline';
  dataSource: MatTableDataSource<any>; //!: SelectionModel<any[]>;
  selectedCell = null;
  //displayedColumnsWithoutSelect: string[];
  //extraDisplayedColumns: string[];
  displayedColumns: string[] = [];
  id = 0;
  dataCount = 0;
  contextMenuItems = null;
  currentContextMenuData = { row: '', column: '' };
  private subs = new Subscription();

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.subscribeToKeyup();
    this.subToHasSelection();
  }

  ngAfterViewInit() {
    this.dataSource!.paginator = this.paginator;
    this.dataSource!.sort = this.sort;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getDisplayedColumns() {
    if (this.hasAction) {
      return [...this.columns, 'action'];
    }
    return this.columns;
  }

  subToHasSelection() {
    const columns = this.getDisplayedColumns();
    this.hasSelection$.subscribe((hasSelection: boolean) => {
      if (hasSelection) {
        this.displayedColumns = ['select', ...columns];
      } else {
        this.displayedColumns = [...columns];
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.multiSelect.emit(this.selection.selected);
  }

  onSelectAllChange(e) {
    this.masterToggle();
  }

  onCheckboxChange(e, row) {
    e ? this.selection.toggle(row) : null;
    this.multiSelect.emit(this.selection.selected);
  }

  closeSelectionColomn() {
    this.selection.clear();
    this.hasSelection$.next(false);
    this.multiSelect.emit(this.selection.selected);
  }

  onRightClick(event: MouseEvent, row: string, column: string) {
    this.currentContextMenuData = { row, column };
  }

  stopEvents(event) {
    this.subs.unsubscribe();
    this.id = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  onActionClick(row, event) {
    this.selectedCell = { row, col: 'action' };
    this.actionClick.emit({ row, event });
  }

  onCellClick(row, col) {
    this.selectedCell = { row, col };
  }

  sendSelectedRow(row) {
    if (this.selectedCell.col === 'action') return;
    this.rowSelect.emit(row);
    if (this.displayedColumns.includes('select')) {
      this.selection.toggle(row);
    }
    this.multiSelect.emit(this.selection.selected);
  }

  private subscribeToKeyup() {
    this.subs.add(
      fromEvent(this.container.nativeElement, 'keyup').subscribe((e: any) => {
        switch (e.code) {
          case 'ArrowDown':
            this.id < this.dataCount ? this.id++ : (this.id = 0);
            break;
          case 'ArrowUp':
            if (this.id > 0) {
              this.id--;
            }
            break;
          case 'Enter':
            if (this.dataSource.data.length > 0) {
              this.sendSelectedRow(this.dataSource.filteredData[this.id]);
            }
        }
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
