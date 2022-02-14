import {
  Component,
  Input,
  OnInit,
  forwardRef,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Style } from '../classes/style';

@Component({
  selector: 'style-form',
  templateUrl: './style-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StyleFormComponent),
      multi: true,
    },
  ],
  styleUrls: ['./style-form.component.scss'],
})
export class StyleFormComponent
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @Input() style = {} as Style;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatSlideToggle) equalCheck: MatSlideToggle;

  form: FormGroup;
  topSub: Subscription = new Subscription();
  // firstPart; /** top | top-left */
  // secondPart;
  // thirdPart; /** bottom | bottom-right */
  // fourthPart;
  isOneValu;
  showAll;
  showFourvalueBtn;
  topLabel = 'top';
  onChange: Function;
  onTouched: Function;

  constructor(private fb: FormBuilder) {
    this.onChange = (_: any) => {};
    this.onTouched = () => {};
  }

  ngOnInit(): void {
    this.showAll = false;
    //this.setProperteis();
    this.buildForm();
    this.showVariants();
    this.form.valueChanges.subscribe((formVal) => {
      this.onChange(formVal);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.handleEqualCheck();
    }, 0);
  }

  // setProperteis() {
  //   const multi = this.styleConfig.multi;
  //   const variants = this.styleConfig.variants;
  //   if (multi) {
  //     if (variants) {
  //       this.setCustomedVariants(variants);
  //     } else {
  //       this.setNormalVariants();
  //     }
  //   } else {
  //     this.setOnePart();
  //   }
  // }

  deleteStyle() {
    this.onDelete.emit();
  }

  // private setNormalVariants() {
  //   this.firstPart = this.styleId + '-top';
  //   this.secondPart = this.styleId + '-right';
  //   this.thirdPart = this.styleId + '-bottom';
  //   this.fourthPart = this.styleId + '-left';
  // }

  // private setCustomedVariants(variants: string[]) {
  //   this.firstPart = variants[0];
  //   this.secondPart = variants[1];
  //   this.thirdPart = variants[2];
  //   this.fourthPart = variants[3];
  // }

  // setOnePart() {
  //   this.firstPart = this.styleId;
  // }

  buildForm() {
    //this.form = this.fb.group(this.generateControlsConfig());
    this.form = this.fb.group(this.style.variantsObj);
  }

  showVariants() {
    if (this.style.multi) {
      this.showAll = true;
      this.showFourvalueBtn = true;
    } else {
      this.showAll = false;
      this.showFourvalueBtn = false;
    }
  }

  // generateControlsConfig() {
  //   if (this.styleConfig.multi) {
  //     this.showAll = true;
  //     this.showFourvalueBtn = true;
  //     return {
  //       [this.firstPart]: null,
  //       [this.secondPart]: null,
  //       [this.thirdPart]: null,
  //       [this.fourthPart]: null,
  //     };
  //   } else {
  //     this.showAll = false;
  //     this.showFourvalueBtn = false;
  //     return {
  //       [this.firstPart]: null,
  //     };
  //   }
  // }

  get topValue() {
    //return this.form.get(this.firstPart).value;
    return this.form.get(this.style.partNameList[0]).value;
  }

  subToTopValue() {
    this.topSub.add(
      this.form
        .get(this.style.partNameList[0])
        .valueChanges.pipe(filter((_) => !this.showAll))
        .subscribe((_) => {
          this.unifyValue();
        })
    );
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
      } else {
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
    } else {
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
    this.form.get(this.style.partNameList[1]).setValue(this.topValue);
    this.form.get(this.style.partNameList[2]).setValue(this.topValue);
    this.form.get(this.style.partNameList[3]).setValue(this.topValue);
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
  setDisabledState(isDisabled: boolean): void {}
}
