import { FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { isPositiveNumberValidator } from '../../../../../sal-common/validators';
import { ButtonConfig } from '../../../../../sal-button/button/button.component';

export interface LineHeightInfo {
  lineHeight: number;
  clickedBtn: string;
}

@Component({
  selector: 'sal-line-height',
  templateUrl: './line-height.component.html',
  styleUrls: ['./line-height.component.scss'],
})
export class LineHeightComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;
  value: FormControl = new FormControl('', [isPositiveNumberValidator()]);
  @Output() valueChange: EventEmitter<LineHeightInfo> =
    new EventEmitter<LineHeightInfo>();
  btnConfig: ButtonConfig = {
    buttonList: [{ label: 'apply', color: 'primary' }, { label: 'cancel' }],
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.value.valueChanges.subscribe((x) => {
      if (this.value.hasError('notPositiveNumber')) {
        this.input.nativeElement.blur();
        this.input.nativeElement.focus();
      }
    });
  }

  close(val?) {
    let info = this.value.hasError('notPositiveNumber')
      ? null
      : {
          lineHeight: this.value.value,
          clickedBtn: val,
        };
    this.valueChange.emit(info);
  }
}
