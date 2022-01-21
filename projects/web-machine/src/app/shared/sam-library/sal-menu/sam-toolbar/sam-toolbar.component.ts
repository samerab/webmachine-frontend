import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem, MenuData } from '../models';

@Component({
  selector: 'sam-toolbar',
  templateUrl: './sam-toolbar.component.html',
  styleUrls: ['./sam-toolbar.component.scss']
})
export class SamToolbarComponent implements OnInit {

  @Input() menuData$: Observable<MenuData>;
  @Output() onItemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  constructor() { }

  ngOnInit(): void {
  }

  onItemClickHandler(item: MenuItem) {
    this.onItemClick.emit(item);
  }

}
