import { Style } from './style';

export class OptionValue extends Style {
  constructor(id: string, options: string[]) {
    super(id, null, null, options);
    this.template = 'optionValue';
    this.setValue({
      option: '',
      value: null,
    });
  }
}
