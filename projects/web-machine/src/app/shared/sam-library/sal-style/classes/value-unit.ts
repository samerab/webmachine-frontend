import { Style } from './style';

export class ValueUnit extends Style {
  constructor(id: string, multi?: boolean, variants?: string[], ...args) {
    super(id, multi, variants);
    this.template = 'valueUnit';
    this.setValue({
      value: args[0] || '',
      unit: args[1] || 'px',
    });
  }

  override get styleValue(): string {
    return `${this.value?.value + this.value?.unit}`;
  }
  override toCss(): string {
    return `${this.id}: ${this.value['value'] + this.value['unit']}`;
  }
}
