import { Style } from './style';

export class Color extends Style {
  constructor(id: string) {
    super(id);
    this.template = 'color';
    this.setValue({
      color: '#ffffff',
    });
  }

  override get styleValue(): string {
    return `${this.value?.color}`;
  }

  override toCss(): string {
    return `${this.id}: ${this.value['color']}`;
  }
}
