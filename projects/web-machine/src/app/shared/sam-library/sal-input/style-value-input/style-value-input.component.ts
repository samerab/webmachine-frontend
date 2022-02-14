import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ElementRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Style } from '../../sal-style/classes/style';

@Component({
  selector: 'style-value-input',
  templateUrl: './style-value-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StyleValueInputComponent),
      multi: true,
    },
  ],
  styleUrls: ['./style-value-input.component.scss'],
})
export class StyleValueInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('valueUnit', { static: true }) valueUnit: TemplateRef<any>;
  @ViewChild('value', { static: true }) value: TemplateRef<any>;
  @ViewChild('color', { static: true }) color: TemplateRef<any>;
  @ViewChild('option', { static: true }) option: TemplateRef<any>;
  @ViewChild('optionValue', { static: true }) optionValue: TemplateRef<any>;
  // typeList: string[] = [];
  // @Input() set type(val: string | string[]) {
  //   if (Array.isArray(val)) {
  //     this.typeList = [...val];
  //   } else {
  //     this.typeList.push(val);
  //   }
  // }
  template;
  private _style;
  @Input() set style(val: Style) {
    this.template = this[val.template];
    this._style = val;
  }
  get style() {
    return this._style;
  }

  // @Input() options: string[];
  // @Input() min: number;
  // @Input() max: number;
  // @Input() step: number;
  @Input() label;
  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();
  hasSpecifiedNumber;

  // types = {
  //   isValueUnit: 'valueUnit',
  //   isOption: 'option',
  //   isOptionValue: 'optionValue',
  //   isColor: 'color',
  //   isSlider: 'slider',
  // };

  units = ['px', '%', 'vh'];

  form: FormGroup;
  onChange: Function;
  onTouched: Function;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private host: ElementRef
  ) {
    this.onChange = (_: any) => {};
    this.onTouched = () => {};
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe((formVal) => {
      this.onChange(formVal);
      //this.onValueChange.emit(this.getVal(formVal));
    });
    // if (this.type === this.types.isOptionValue) {
    //   this.form.get('option').valueChanges.subscribe((val) => {
    //     if (val === 'specifiedNumber') {
    //       this.hasSpecifiedNumber = true;
    //     } else {
    //       this.hasSpecifiedNumber = false;
    //       this.form.get('value').setValue(null);
    //     }
    //   });
    // }
  }

  // getVal(val: { value: string; unit: string }) {
  //   return val.value + val.unit;
  // }

  buildForm() {
    //this.form = this.fb.group(this.generateControlsConfig());
    this.form = this.fb.group(this.style?.value);
  }

  // generateControlsConfig() {
  //   // if (this.type === this.types.isBorder) {
  //   //   return this.border;
  //   // } else
  //   if (this.type === this.types.isValueUnit) {
  //     this.renderer.addClass(this.host.nativeElement, 'val-unit');
  //     return this.valueWithUnit;
  //   } else if (this.type === this.types.isColor) {
  //     this.renderer.addClass(this.host.nativeElement, 'color');
  //     return this.colorConfig;
  //   } else if (this.type === this.types.isOption) {
  //     this.renderer.addClass(this.host.nativeElement, 'option');
  //     return this.optionConfig;
  //   } else if (this.type === this.types.isOptionValue) {
  //     this.renderer.addClass(this.host.nativeElement, 'option-val');
  //     return this.optionWithValue;
  //   } else if (this.type === this.types.isSlider) {
  //     this.renderer.addClass(this.host.nativeElement, 'option-val');
  //     return this.valueSlider;
  //   }
  //   return null;
  // }

  // generateControlsConfig() {
  //   const s = this.styleConfig;
  //   if (s.hasValueWithUnit && s.hasOptions && s.hasColor) {
  //     return this.ValueUnitTypeColor;
  //   }
  //   else if (s.hasValueWithUnit) {
  //     this.renderer.addClass(this.host.nativeElement, 'val-unit');
  //     return this.valueWithUnit;
  //   }
  //   else if (s.hasColor) {
  //     this.renderer.addClass(this.host.nativeElement, 'color');
  //     return this.colorConfig;
  //   }
  //   else if (s.hasOptions) {
  //     this.renderer.addClass(this.host.nativeElement, 'option');
  //     return this.optionConfig;
  //   }
  //   else if (s.hasOptionsWithValues) {
  //     this.renderer.addClass(this.host.nativeElement, 'option-val');
  //     return this.optionWithValue;
  //   }
  //   else if (s.hasValueSlider) {
  //     this.renderer.addClass(this.host.nativeElement, 'option-val');
  //     return this.valueSlider;
  //   }
  //   return null
  // }

  // get valueWithUnit() {
  //   return {
  //     value: '',
  //     unit: 'px',
  //   };
  // }

  // get border() {
  //   return {
  //     value: '1',
  //     unit: 'px',
  //     option: 'solid',
  //     color: '#000000',
  //   };
  // }

  // get colorConfig() {
  //   return {
  //     color: '#000000',
  //   };
  // }

  // get optionConfig() {
  //   return {
  //     option: '#000000',
  //   };
  // }

  // get optionWithValue() {
  //   return {
  //     option: null,
  //     value: null,
  //   };
  // }

  // get valueSlider() {
  //   return {
  //     value: null,
  //   };
  // }

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
  setDisabledState(isDisabled: boolean): void {}
}
