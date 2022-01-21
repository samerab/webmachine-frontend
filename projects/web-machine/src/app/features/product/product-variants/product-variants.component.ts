import { ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

interface ProductVariant {
  name: string;
  options: string[];
}

@Component({
  selector: 'ws-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss']
})
export class ProductVariantsComponent implements OnInit {

  /**
   * We have to wrap everything into an array, otherwise angular thinks 
   * that [1, 2, 3, 4] is a form control definition rather than a form control value.
   * for more info go to :
   * https://stackoverflow.com/questions/37564574/angular-2-typescript-typeerror-this-validator-is-not-a-function
  */

  @Input() form;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addVariant()
  }

  get variantsArray() {
    return this.form.get('variantList') as FormArray;
  }

  get variantsControls() {
    return this.variantsArray.controls;
  }

  addOption(event: MatChipInputEvent, index: number) {
    const option = event.value;
    if ((option || '').trim()) {
      const options = [...this.getOptions(index), option];
      this.updateVariant(index, null, options)
    }
  }

  removeOption(option: string, index: number) {
    const options = [...this.getOptions(index)];
    const i = options.indexOf(option)
    if (i > -1) {
      options.splice(i, 1);
    }
    this.updateVariant(index, null, options)
  }

  addVariant(variant?) {
    let v;
    if (!variant) {
      v = this.getVariantControl({name: '', options: null});
    }
    else {
      v = this.getVariantControl(variant);
    }
    this.variantsArray.push(v)
  }

  updateVariant(index, name?, options?) {
    const oldVariant = this.variantsControls[index].value;
    let update = {...oldVariant};
    if (name) {
      update = {...update, name}
    }
    if (options) {
      update = {...update, options: [options]}
    }
    const v = this.getVariantControl(update);
    this.variantsArray.setControl(index, v)
  }

  getOptions(index: number): string[] {
    const options = this.variantsControls[index].get('options').value;
    if (options) {
      return options
    }
    return [];
  }

  getVariantControl(variant: ProductVariant) {
    return this.fb.group(variant)
  }


}
