import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { BlockContent } from '../../../page.model';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, AfterViewInit, BlockContent {
  @ViewChild('content') content: ElementRef<HTMLDivElement>;
  data: { html: string };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.content.nativeElement.innerHTML = this.data?.html;
  }
}
