import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonConfig } from '@ws-sal';

@Component({
  selector: 'sal-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.scss']
})
export class ChangeNameComponent implements OnInit {

  @Input() name: string;

  @Output() onItemClick: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  buttonsConfig: ButtonConfig = {
    buttonList: [
      { label: 'save', color: 'primary' },
      { label: 'cancel' },
    ],
    height: '50px'
  }

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select()
    }, 300);
  }

  onClick(label, value) {
    this.onItemClick.emit({label, value});
  }


}
