import { L } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ButtonConfig } from '../../sal-button/button/button.component';
import { CustomEventService } from '../../sal-common/custom.event.service';
import { StyleConfig } from '../../sal-page/page.model';
import { PopupService } from '../../sal-popup/index';
import { Style } from '../classes/style';
import { STYLES_LIST } from '../styles';

@Component({
  selector: 'ws-style-builder',
  templateUrl: './style-builder.component.html',
  styleUrls: ['./style-builder.component.scss'],
})
export class StyleBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('template') template: TemplateRef<any>;

  form: FormGroup;
  sub: Subscription = new Subscription();
  isInit = true;
  buttonConfig: ButtonConfig = {
    buttonList: [{ label: 'add', icon: 'add', color: 'accent' }],
    height: '50px',
  };

  constructor(
    private fb: FormBuilder,
    private popupSv: PopupService,
    private event: CustomEventService,
    private host: ElementRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.subToSavedStyle();
    this.onFormChange();
  }

  ngAfterViewInit(): void {
    this.sub.add(
      fromEvent(this.host.nativeElement, 'mouseenter')
        .pipe(take(1))
        .subscribe((_) => (this.isInit = false))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      styles: this.fb.array([]),
    });
  }

  private subToSavedStyle() {
    this.sub.add(
      this.event
        .on('styleList')
        .pipe(
          filter((styleList) => !!styleList),
          take(1)
        )
        .subscribe((styleList) => {
          this.setSavedStyleList(styleList);
        })
    );
  }

  setSavedStyleList(styleList: StyleConfig[]) {
    for (const StyleConfig of styleList) {
      this.styleFormArray.push(this.fb.group(StyleConfig));
    }
  }

  onFormChange() {
    this.sub.add(
      this.form.valueChanges.subscribe((_) => {
        if (!this.isInit) {
          this.sendGeneratedStyle();
        }
      })
    );
  }

  get stylesControls() {
    return this.styleFormArray.controls;
  }

  get styleFormArray() {
    return this.form.get('styles') as FormArray;
  }

  // addStyle(styleConfig: StyleConfig) {
  //   const formGroup = this.fb.group({
  //     id: styleConfig.id,
  //     value: null,
  //   });
  //   this.styleFormArray.push(formGroup);
  // }
  addStyle(style: Style) {
    const formGroup = this.fb.group({
      style,
      value: null,
    });
    this.styleFormArray.push(formGroup);
  }

  dialog: MatDialogRef<any, any>;
  onClick(label) {
    switch (label) {
      case 'add':
        this.openStyleList();
        break;
    }
  }

  private openStyleList() {
    this.dialog = this.popupSv.openPopup1(this.template, STYLES_LIST, {
      width: '400px',
      position: { top: '5%' },
    });
  }

  sendGeneratedStyle() {
    this.event.emit({
      name: 'styleListFromStyleBuilder',
      value: this.form.value.styles,
    });
  }

  onStyleSelect(style: Style) {
    this.addStyle(style);
    this.dialog.close();
  }

  deleteStyle(index: number) {
    this.styleFormArray.removeAt(index);
  }
}
