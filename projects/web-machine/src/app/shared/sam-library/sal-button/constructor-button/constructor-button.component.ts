import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'constructor-button',
  templateUrl: './constructor-button.component.html',
  styleUrls: ['./constructor-button.component.scss']
})
export class ConstructorButtonComponent implements OnInit {

  @Input() label: string;
  @Input() icon: string;
  @Input() color: string;
  @Input() type: string;
  @Input() primaryDisabled = false;
  @Output() onBtnClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onBtnClickHandler() {
    this.onBtnClick.emit(this.label);
  }

}
