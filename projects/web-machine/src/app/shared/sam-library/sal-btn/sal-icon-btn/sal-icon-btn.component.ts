import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'sal-icon-btn',
  templateUrl: './sal-icon-btn.component.html',
  styleUrls: ['./sal-icon-btn.component.scss'],
})
export class SalIconBtnComponent implements OnInit, AfterViewInit {
  @Input() icon: string;
  @Input() text: string;
  @Input() className = '';

  constructor(private rendere: Renderer2, private host: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.className !== '') {
      this.rendere.addClass(this.host.nativeElement, this.className);
    }
  }
}
