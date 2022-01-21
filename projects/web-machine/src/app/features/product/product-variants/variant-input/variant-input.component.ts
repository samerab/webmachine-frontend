import { Component, OnInit, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ws-variant-input',
  templateUrl: './variant-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VariantInputComponent), 
      multi: true,
    }
  ],
  styleUrls: ['./variant-input.component.scss']
})
export class VariantInputComponent implements OnInit, ControlValueAccessor {

  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() title = 'خيار إضافي للمنتج'
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  private _option = {
    variantName: '',
    variantOptions: []
  };
  private onChange: Function;

  constructor(
  ) 
  {
      this.onChange = (_: any) => {};
  }

  ngOnInit() {
    // if (this.vName != null) {
    //   this.variantName.setValue(this.vName)
    // }
    // if (this.vValues != null) {
    //   this.variantValues = this.vValues;
    // }
    // this.variantName.valueChanges.pipe(debounceTime(1000)).subscribe( _ => {
    //   this.send();
    // })
    // this.option['variantName'].valueChanges.pipe(debounceTime(1000)).subscribe( _ => {
    //   this.send();
    // })
  }

  private send() {
    this.setOption(this.option);
    this.addEvent.emit();
    // this.setOption({
    //   variantName: this.option['variantName'].value,
    //   variantOptions: this.option['variantOptions']
    // });
  }

  
  // private send() {
  //   this.setOption({
  //     variantName: this.variantName.value,
  //     variantOptions: this.variantValues
  //   });
  // }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      //this.variantValues.push(value.trim());
      this.option['variantOptions'].push(value.trim());
    }

    if (input) {
      input.value = '';
      this.send();
    }
  }

  remove(fruit): void {
   // const index = this.variantValues.indexOf(fruit);
   const index = this.option['variantOptions'].indexOf(fruit);

    if (index >= 0) {
      this.option['variantOptions'].splice(index, 1);
      this.send();
    }
  }
  
  public get option() {
    return this._option;
  }

  
  public set option(value) {
    this._option = value;
  }

  setOption(option){
    this.option = option;
    this.onChange(this.option);
  }

  writeValue(obj: any): void { 
    this.option = obj;
  }
  registerOnChange(fn: any): void { 
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}

  


}
