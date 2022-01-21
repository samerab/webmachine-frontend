import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sal-icon-btn',
  templateUrl: './sal-icon-btn.component.html',
  styleUrls: ['./sal-icon-btn.component.scss'],
})
export class SalIconBtnComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;

  constructor() {}

  ngOnInit() {}
}
