import { Component, Input, OnInit, forwardRef, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StyleConfig } from '../../sal-page/page.model';
import { STYLES } from '../styles';

@Component({
  selector: 'style-form',
  templateUrl: './style-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StyleFormComponent),
      multi: true
    }
  ],
  styleUrls: ['./style-form.component.scss']
})
export class StyleFormComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  _styleId;
  @Input() set styleId(val: string) {
    this._styleId = val;
    this.styleConfig = STYLES.find(styleConfig => styleConfig.id === val);
  }
  get styleId() {
    return this._styleId;
  }

  styleConfig: StyleConfig;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatSlideToggle) equalCheck: MatSlideToggle;

  form: FormGroup;
  topSub: Subscription = new Subscription();
  firstPart; /** top | top-left */
  secondPart;
  thirdPart; /** bottom | bottom-right */
  fourthPart;
  isOneValu;
  showAll;
  showFourvalueBtn;
  topLabel = 'top';
  onChange: Function;
  onTouched: Function;

  constructor(
    private fb: FormBuilder,
  ) {
    this.onChange = (_: any) => { };
    this.onTouched = () => { };
  }

  ngOnInit(): void {
    this.showAll = false;
    this.setProperteis();
    this.buildForm();
    this.form.valueChanges.subscribe(formVal => {
      this.onChange(formVal);
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.handleEqualCheck();
      
    }, 0);
  }

  setProperteis() {
    switch (this.styleConfig.type) {
      case 'radius':
        this.setBorderRadius();
        break;
      case 'oneValue':
        this.setOnePart();
        break;
      default:
        this.setFourPart();
        break;
    }
  }

  deleteStyle() {
    this.onDelete.emit();
  }

  private setFourPart() {
    this.firstPart = this.styleId + '-top';
    this.secondPart = this.styleId + '-right';
    this.thirdPart = this.styleId + '-bottom';
    this.fourthPart = this.styleId + '-left';
  }

  private setBorderRadius() {
    this.firstPart = this.styleId.replace('-', '-top-left-');
    this.secondPart = this.styleId.replace('-', '-top-right-');
    this.thirdPart = this.styleId.replace('-', '-bottom-right-');
    this.fourthPart = this.styleId.replace('-', '-bottom-left-');
  }

  setOnePart() {
    this.firstPart = this.styleId;
  }

  buildForm() {
    this.form = this.fb.group(this.generateControlsConfig());
  }

  generateControlsConfig() {
    const s = this.styleConfig;
    if (s.hasFourValues) {
      this.showAll = true;
      this.showFourvalueBtn = true;
      return {
        [this.firstPart]: null,
        [this.secondPart]: null,
        [this.thirdPart]: null,
        [this.fourthPart]: null,
      };
    }
    else {
      this.showAll = false;
      this.showFourvalueBtn = false;
      return {
        [this.firstPart]: null
      };
    }
  }

  get topValue() {
    return this.form.get(this.firstPart).value;
  }

  subToTopValue() {
    this.topSub.add(
      this.form.get(this.firstPart).valueChanges
        .pipe(
          filter(_ => !this.showAll)
        )
        .subscribe(_ => {
          this.unifyValue()
        })
    )
  }

  unSubFromTopValue() {
    this.topSub.unsubscribe();
  }

  handleEqualCheck() {
    let value;
    let equal = true;
    for (const [key, val] of Object.entries(this.form.value)) {
      if (value) {
        if (JSON.stringify(val) !== JSON.stringify(value)) {
          equal = false;
          break;
        }
      }
      else {
        value = val;
      }
    }
    if (equal && this.equalCheck) {
      this.equalCheck.checked = true;
      this.onCheckboxChange(true);
    }
  }

  onCheckboxChange(checked) {
    if (checked) {
      this.unify();
      this.subToTopValue();
    }
    else {
      this.separate();
      //this.unSubFromTopValue();
    }
  }

  unify() {
    this.unifyValue();
    this.showAll = false;
    this.topLabel = 'all dirction';
  }

  unifyValue() {
    const val = this.topValue;
    this.form.get(this.secondPart).setValue(val);
    this.form.get(this.thirdPart).setValue(this.topValue);
    this.form.get(this.fourthPart).setValue(this.topValue);
  }

  separate() {
    this.showAll = true;
    this.topLabel = 'top';
  }

  writeValue(obj: any): void {
    if (obj) {
      this.form.setValue(obj);
      // if (!obj.default) {
      // }
      // else {
      //   this.form.setValue(obj.default);
      // }
    }
  }

  // writeValue(obj: any): void {
  //   if (obj) {
  //     this.form.setValue(obj);
  //   }
  // }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void { }

}
