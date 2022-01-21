import { Observable } from 'rxjs';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Cell } from '../../../page.model';

@Component({
  selector: 'ws-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss']
})
export class GridCellComponent implements OnInit, AfterViewInit {

  @Input() cell: Cell;
  @Input() changeColor$: Observable<Cell>;
  @Output() onClick: EventEmitter<Cell> = new EventEmitter<Cell>();
  @ViewChild('cell') cellElem: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.onChangeColor();
  }

  private onChangeColor() {
    this.changeColor$
      .pipe(
        filter(cell => !!cell)
      )
      .subscribe(cell => {
        if (this.cell.row === cell.row && this.cell.col === cell.col) {
          this.renderer.setStyle(this.cellElem.nativeElement, 'backgroundColor', cell.color);
        }
      });
  }

  send() {
    this.onClick.emit(this.cell);
  }

}
