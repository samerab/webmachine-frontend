import { Color } from './classes/color';
import { Style } from './classes/style';
import { Transform } from './classes/transform';
import { ValueUnit } from './classes/value-unit';
import { Option } from './classes/option';

export enum StyleType {
  valueUnit = 'valueUnit',
  color = 'color',
  option = 'option',
}

export interface StyleConfig {
  id: string /** margin | padding... */;
  type: StyleType | StyleType[];
  multi?: boolean;
  variants?: string[];
  options?: string[];
}

const optionsGroup1 = ['center', 'flex-start', 'flex-end'];

export const STYLES_LIST: Style[] = [
  new ValueUnit('margin', true),
  new ValueUnit('padding', true),
  new ValueUnit('border-radius', true, []),
  new ValueUnit('width'),
  new ValueUnit('min-width'),
  new ValueUnit('height'),
  new ValueUnit('gap'),
  new Color('color'),
  new Color('background-color'),
  new Option('justify-self', optionsGroup1),
  new Option('place-items', optionsGroup1),
  new Option('place-content', optionsGroup1),
  new Transform('rotate'),
  new Transform('scale'),
];

function getStylesAsObject() {
  return STYLES_LIST.map((style) => {
    return { [style.id]: style };
  });
}

export const STYLES_OBJECT = { ...getStylesAsObject() };

export function getStyle(id: string) {
  return STYLES_LIST.find((style) => style.id === id);
}

export function createStyle(id: string, ...args) {
  const style = STYLES_LIST.find((style) => style.id === id);
  if (style) {
    style.setValue(args);
    return style;
  }
  return null;
}
