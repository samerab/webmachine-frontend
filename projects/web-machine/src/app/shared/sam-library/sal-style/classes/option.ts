import { Style } from './style';

export class Option extends Style {
  constructor(id: string, options: string[]) {
    super(id, null, null, options);
    this.template = 'option';
    this.setValue({
      option: '',
    });
  }

  override get styleValue(): string {
    return `${this.value?.option}`;
  }

  override toCss(): string {
    return `${this.id}: ${this.value['option']}`;
  }
}
