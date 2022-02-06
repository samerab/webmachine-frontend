import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Block, BlockTemplate } from '../../../page.model';
import { fromJS } from 'immutable';

interface TextBlockTemplate extends Omit<Block, 'settings'> {
  settings: { html: string };
}

@Component({
  selector: 'text-template',
  templateUrl: './text-template.component.html',
  styleUrls: ['./text-template.component.scss'],
})
export class TextTemplateComponent
  implements OnInit, AfterViewInit, BlockTemplate
{
  @ViewChild('content') content: ElementRef<HTMLDivElement>;
  data: TextBlockTemplate;
  mutableData;
  defaultText = 'Text goes here...';

  constructor(public host: ElementRef) {}

  ngOnInit(): void {
    this.mutableData = fromJS(this.data);
    this.setDefault();
  }

  ngAfterViewInit() {
    this.updateSettings(this.data?.settings);
  }

  updateSettings(settings) {
    this.content.nativeElement.innerHTML = settings?.html;
  }

  setDefault() {
    if (!this.data?.settings?.html) {
      const _data = this.mutableData.setIn(['settings'], {
        html: this.defaultText,
      });
      this.data = { ..._data.toJS() };
    }
  }
}
