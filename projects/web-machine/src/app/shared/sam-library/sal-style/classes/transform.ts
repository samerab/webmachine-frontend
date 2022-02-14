import { Style } from './style';

export class Transform extends Style {
  constructor(id: string) {
    super(id);
    this.template = 'value';
    this.setValue({
      value: null,
    });
  }

  override get styleValue(): string {
    switch (this.id) {
      case 'rotate':
        return `rotate(${this.value?.value}deg)`;
      case 'scale':
        return `scale(${this.value?.value},${this.value?.value})`;
      default:
        return '';
    }
  }

  override get styleName(): string {
    return 'transform';
  }

  override toCss(): string {
    switch (this.id) {
      case 'rotate':
        return `transform: rotate(${this.value['value']}deg)`;
      case 'scale':
        return `transform: scale(${this.value['value']},${this.value['value']})`;
      default:
        return '';
    }
  }
}
