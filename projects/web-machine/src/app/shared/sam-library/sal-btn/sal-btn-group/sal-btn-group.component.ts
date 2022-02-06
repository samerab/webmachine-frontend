import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
} from '@angular/core';
import { SalBtnComponent } from '../sal-btn/sal-btn.component';

@Component({
  selector: 'sal-btn-group',
  templateUrl: './sal-btn-group.component.html',
  styleUrls: ['./sal-btn-group.component.scss'],
})
export class SalBtnGroupComponent implements OnInit, AfterContentInit {
  @Input() gap = '20px';
  @Input() height = '50px';
  @Input() gridTemplateColumns = '200px 200px';

  @ContentChildren(SalBtnComponent) children: QueryList<SalBtnComponent>;

  constructor(private host: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.setStyle();
  }

  private setStyle() {
    this.renderer.setStyle(
      this.host.nativeElement,
      'grid-template-columns',
      this.genGridTemplateColumns()
    );
    this.renderer.setStyle(this.host.nativeElement, 'grid-gap', this.gap);
    this.renderer.setStyle(this.host.nativeElement, 'height', this.height);
  }

  private genGridTemplateColumns() {
    if (!this.gridTemplateColumns) {
      let frs = '';
      for (const btn of this.children.toArray()) {
        frs = frs + ' 1fr';
      }
      frs = frs.slice(1);
      return frs;
    }
    return this.gridTemplateColumns;
  }
}
