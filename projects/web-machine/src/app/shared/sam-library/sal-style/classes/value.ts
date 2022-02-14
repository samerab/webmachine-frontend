import { Style } from './style';

export class Value extends Style {
  constructor(id: string) {
    super(id);
    this.template = 'value';
    this.setValue({
      value: '',
    });
  }

  override get styleValue(): string {
    return `${this.value?.value + this.value?.unit}`;
  }
  override toCss(): string {
    return `${this.id}: ${this.value['value'] + this.value['unit']}`;
  }
}
