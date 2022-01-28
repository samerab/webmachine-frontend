import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sal-search-or-paste',
  templateUrl: './search-or-paste.component.html',
  styleUrls: ['./search-or-paste.component.scss']
})
export class SearchOrPasteComponent implements OnInit {

  @Output() apply: EventEmitter<string> = new EventEmitter<string>();
  link: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  onApply() {
    this.apply.emit(this.link.value)
  }

}
