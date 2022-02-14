export class Style {
  template: string;
  partNameList = [];
  variantsObj;
  cssValue = '';
  private _value = {} as any;

  constructor(
    public id?: string,
    public multi?: boolean,
    public variants?: string[],
    public options?: string[]
  ) {
    this.setVariants();
  }

  toCss(): string {
    return '';
  }
  setValue(val) {
    this._value = val;
  }
  get value() {
    return this._value;
  }

  get styleValue(): string {
    return '';
  }

  get styleName(): string {
    return this.id;
  }

  private setVariants() {
    let obj = {};
    if (this.multi) {
      if (this.variants) {
        for (const variant of this.variants) {
          this.partNameList.push(variant);
          obj[variant] = null;
        }
      } else {
        for (const item of ['-top', '-right', '-bottom', '-left']) {
          const variant = this.id + item;
          this.partNameList.push(variant);
          obj[variant] = null;
        }
      }
    } else {
      this.partNameList.push(this.id);
      obj[this.id] = null;
    }
    this.variantsObj = { ...obj };
  }
}
