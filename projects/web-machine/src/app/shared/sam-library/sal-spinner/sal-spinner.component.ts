import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sal-spinner',
  templateUrl: './sal-spinner.component.html',
  styleUrls: ['./sal-spinner.component.css'],
})
export class SalSpinnerComponent implements OnInit {
  @Input() on$: Observable<boolean> = of(false);

  constructor() {}

  ngOnInit() {}
}
