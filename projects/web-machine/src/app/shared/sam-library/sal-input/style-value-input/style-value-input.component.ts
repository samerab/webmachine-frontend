import { StyleConfig } from './../../sal-page/page.model';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'style-value-input',
  templateUrl: './style-value-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StyleValueInputComponent),
      multi: true
    }
  ],
  styleUrls: ['./style-value-input.component.scss']
})
export class StyleValueInputComponent implements OnInit, ControlValueAccessor {

  @Input() styleConfig: StyleConfig;
  @Input() label;
  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();
  hasSpecifiedNumber;

  units = [
    'px', '%', 'vh'
  ];

  form: FormGroup;
  onChange: Function;
  onTouched: Function;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private host: ElementRef
  ) {
    this.onChange = (_: any) => { };
    this.onTouched = () => { };
  }


  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe(formVal => {
      this.onChange(formVal);
      //this.onValueChange.emit(this.getVal(formVal));
    })
    if (this.styleConfig.hasOptionsWithValues) {
      this.form.get('option').valueChanges.subscribe(val => {
        if (val === 'specifiedNumber') {
          this.hasSpecifiedNumber = true;
        }
        else {
          this.hasSpecifiedNumber = false;
          this.form.get('value').setValue(null);
        }
      })
    }
  }

  getVal(val: { value: string; unit: string; }) {
    return val.value + val.unit;
  }

  buildForm() {
    this.form = this.fb.group(this.generateControlsConfig());
  }

  generateControlsConfig() {
    const s = this.styleConfig;
    if (s.hasValueWithUnit && s.hasOptions && s.hasColor) {
      return this.ValueUnitTypeColor;
    }
    else if (s.hasValueWithUnit) {
      this.renderer.addClass(this.host.nativeElement, 'val-unit');
      return this.valueWithUnit;
    }
    else if (s.hasColor) {
      this.renderer.addClass(this.host.nativeElement, 'color');
      return this.colorConfig;
    }
    else if (s.hasOptions) {
      this.renderer.addClass(this.host.nativeElement, 'option');
      return this.optionConfig;
    }
    else if (s.hasOptionsWithValues) {
      this.renderer.addClass(this.host.nativeElement, 'option-val');
      return this.optionWithValue;
    }
    else if (s.hasValueSlider) {
      this.renderer.addClass(this.host.nativeElement, 'option-val');
      return this.valueSlider;
    }
    return null
  }

  get valueWithUnit() {
    return {
      value: '',
      unit: 'px'
    }
  }

  get ValueUnitTypeColor() {
    return {
      value: '',
      unit: 'px',
      option: 'solid',
      color: '#000000'
    }
  }

  get colorConfig() {
    return {
      color: '#000000'
    }
  }

  get optionConfig() {
    return {
      option: '#000000',
    }
  }

  get optionWithValue() {
    return {
      option: null,
      value: null
    }
  }

  get valueSlider() {
    return {
      value: null
    }
  }


  writeValue(obj: any): void {
    if (obj) {
      this.form.setValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void { }

}
