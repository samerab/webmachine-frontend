import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'sal-btn',
  templateUrl: './sal-btn.component.html',
  styleUrls: ['./sal-btn.component.scss'],
})
export class SalBtnComponent implements OnInit, AfterViewInit {
  @ViewChild('raised') raised: TemplateRef<any>;
  @ViewChild('transparent') transparent: TemplateRef<any>;
  @ViewChild('iconText') iconText: TemplateRef<any>;

  @ViewChild('btnText') btnText: ElementRef<HTMLTemplateElement>;

  template: TemplateRef<any>;
  context: any;

  @Input() type = 'raised';
  @Input() icon = null;
  @Input() className = '';

  constructor(private rendere: Renderer2, private host: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.setType();
    this.setClass();
  }

  private setClass() {
    if (this.className !== '') {
      this.rendere.addClass(this.host.nativeElement, this.className);
    }
  }

  setType() {
    const text = this.btnText.nativeElement.textContent;
    if (this.icon) {
      this.template = this.iconText;
      this.context = { text, icon: this.icon };
    } else {
      switch (this.type) {
        case 'raised':
          this.template = this.raised;
          break;
        case 'transparent':
          this.template = this.transparent;
          break;
        default:
          this.template = this.raised;
          break;
      }
      this.context = { text };
    }
  }
}
