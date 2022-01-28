export class Page {
  id: string;
  info: PageInfo;
  content: Grid[];
}

export interface PageInfo {
  title: string;
  slug: string;
  description: string;
  type?: string;
}

export class Grid {
  id: string;
  sectionList: Section[];
  layout?: any;
  styleList?: Style[];
  settings?: any;
  isFixed?: boolean;
}

export interface FixedGrid {
  id: string;
  content: Grid;
}

export interface Section {
  id: string;
  blockList: Block[];
  layout?: any;
  styleList?: Style[];
  settings?: any;
}

export class Block {
  id: string;
  component: string;
  properties?: Object;
  styleList?: Style[];
  settings?: any;
}

export class SectionListToAdd {
  gridId: string;
  sectionList: Section[];
}

export class BlockToAdd {
  sectionId: string;
  block: Block;
}

export class GridToUpdate {
  id: string;
  settings?: GridSettings;
  styleList?: StyleConfig[];
}

export interface GridSettings {
  columns: number;
  rows: number;
  columnWidthArray: any[];
  rowHeightArray: any[];
  name: string;
  sectionsCount: number;
  layout: any;
  color: string;
  mergeInfoList: MergeInfo[];
}

export interface MGroup {
  id: string;
  color: string;
  cells: Cell[];
}

export interface Cell {
  row: number;
  col: number;
  color?: string;
}

export interface MergeInfo {
  css: any;
  targetSectionIndex: number;
  mergedCellsCount: number;
}

export class Css {
  id: string;
  css: any;
}

export interface Style {
  id: string /** margin | padding... */;
  value?: any;
}

export interface StyleConfig {
  id?: string /** margin | padding... */;
  type?: string;
  options?: string[];
  default?: any;
  hasColor?: boolean;
  hasValueWithUnit?: boolean;
  hasValueSlider?: boolean;
  hasOptions?: boolean;
  hasOptionsWithValues?: boolean;
  hasFourValues?: boolean;
  max?: number;
  min?: number;
  step?: number;
}

export interface StyleData {
  sender: string;
  styleList: Style[];
}

export interface SettingsData {
  sender: string;
  settings: any;
}

export interface BlockContent {
  data: any;
}

export interface BlockTemplate {
  data: any;
  setDefault: () => {};
}
