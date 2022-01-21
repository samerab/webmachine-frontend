import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../../sal-popup';
import { ResultsPopupComponent } from '../../sal-popup/resultsPopup/resultsPopup.component';
import { v4 as uuid } from 'uuid';
import { PageService } from '../services/page.service';
import { FixedGrid, Grid } from '../page.model';
import { Observable } from 'rxjs';
import { EventService, SalEventName } from '../../sal-common/event.service';


@Component({
  selector: 'fixed-grid-dashboard',
  templateUrl: './fixed-grid-dashboard.component.html',
  styleUrls: ['./fixed-grid-dashboard.component.scss']
})
export class FixedGridDashboardComponent implements OnInit {

  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('gridNameTemplate') gridNameTemplate: TemplateRef<any>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  fixedGridList$: Observable<Grid[]>;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  status: string; /** 'add' | 'edit' */
  currentFixedGrid: Grid;

  constructor(
    private popupSv: PopupService,
    private pageSv: PageService,
    private eventSv: EventService
  ) { }

  ngOnInit(): void {
    this.fixedGridList$ = this.pageSv.fixedGridListSubject$
  }

  addGrid() {
    this.status = 'add';
    this.openPopup()
  }

  editGridName(grid: Grid) {
    this.status = 'edit';
    this.openPopup(grid?.settings?.name);
    this.currentFixedGrid = grid;
  }

  openPopup(name?) {
    const config = {
      width: '390px',
      height: '280px',
      position: { top: '200px' },
      hasBackdrop: false
    }
    this.dialogRef = this.popupSv.openPopup1(this.gridNameTemplate, name, config);
  }

  onButtonSelect(data: { label: string, value: string }) {
    switch (data.label) {
      case 'save':
        if (this.status === 'add') {
          this.addFixedGrid(data.value)
        }
        else {
          this.updateFixedGrid(data.value)
        }
        this.dialogRef.close()
        break;
      case 'cancel':
        this.dialogRef.close()
        break;
    }
  }

  updateFixedGrid(name) {
    const update = {
      id: this.currentFixedGrid.id, 
      changes: {
        settings: {
          ...this.currentFixedGrid.settings,
          name
        }
      }
    };
    this.eventSv.emit({
      name: SalEventName.ADD_FIXED_GRID_TEMPLATE,
      value: {
        action: 'update',
        payload: update
      }
    })
  }

  addFixedGrid(name: string) {
    const fixedGrid = this.generateGrid(name);
    this.eventSv.emit({
      name: SalEventName.ADD_FIXED_GRID_TEMPLATE,
      value: {
        action: 'add',
        payload: fixedGrid
      }
    })
  }

  remove(id) {
    this.eventSv.emit({
      name: SalEventName.ADD_FIXED_GRID_TEMPLATE,
      value: {
        action: 'delete',
        payload: id
      }
    })
  }


  generateGrid(name: string) {
    return {
      id: uuid(),
      isFixed: true,
      sectionList: [{
        id: uuid(),
        blockList: []
      }],
      settings: {
        name,
        test: 5
      },
    };
  }

}
