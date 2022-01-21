import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { PopupService } from '../../../../sal-popup';
import { Cell, GridSettings, MGroup, MergeInfo } from '../../../page.model';


@Component({
  selector: 'ws-grid-cells',
  templateUrl: './grid-cells.component.html',
  styleUrls: ['./grid-cells.component.scss']
})
export class GridCellsComponent implements OnInit {

  @Input() cellList: Cell[];
  @Input() settings: GridSettings
  @Input() mergeInfo: any;
  @Input() removeMerge$: Observable<any>;
  @Output() onMerge: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('groupDiv') groupDivs: QueryList<ElementRef<HTMLElement>>;
  changeColorSubject: BehaviorSubject<Cell> = new BehaviorSubject<Cell>(null);
  checkList = [];
  mark: Cell;
  currentMergeGroupId: string;
  mergeGroupList: MGroup[] = [];

  constructor(
    private popupSv: PopupService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.removeMerge$.subscribe(_ => this.mergeGroupList.splice(0));
    setTimeout(() => {
      this.extractMergeData();
    }, 100);
  }

  extractMergeData() {
    if (this.settings?.mergeInfoList?.length) {
      let allCells = [];
      for (const mi of this.settings.mergeInfoList) {
        const mergeObject = this.getMergeObject(mi);
        if (mergeObject.minRow === mergeObject.maxRow && mergeObject.minCol === mergeObject.maxCol) {
          allCells.push({ row: mergeObject.minRow, col: mergeObject.minCol })
        }
        else {
          const cells = this.getGroupCells(this.getMergeObject(mi));
          allCells = [...allCells, ...cells];
          const {length, color} = this.addNewGroup(cells, false);
          this.changeGroupColor(true, this.mergeGroupList[length - 1], color);
        }
      }
    }

  }

  getMergeObject(mergeInfo) {
    const minMaxColArr = mergeInfo['grid-column'].split('/');
    const minMaxRowArr = mergeInfo['grid-row'].split('/');
    const mergeObject = {
      minRow: +minMaxRowArr[0],
      maxRow: +minMaxRowArr[1] - 1,
      minCol: +minMaxColArr[0],
      maxCol: +minMaxColArr[1] - 1
    }
    return mergeObject;
  }

  getGroupCells(mergeObject) {
    const cells = [];
    for (let col = mergeObject.minCol; col <= mergeObject.maxCol; col++) {
      for (let row = mergeObject.minRow; row <= mergeObject.maxRow; row++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }

  changeCurrentGroupId(id: string) {
    this.currentMergeGroupId = id;
  }

  changeGroupIdAndStyle(id: string, index: number) {
    this.changeCurrentGroupId(id);
    this.removeActiveStyle();
    this.addActiveStyle(index);
  }

  private styleActiveGroup(divIndex: any) {
    this.removeActiveStyle();
    this.addActiveStyle(divIndex);
  }

  addActiveStyle(divIndex: any) {
    if (!this.groupDivs) return;
    const divs = this.groupDivs.toArray();
    const elem = divs[divIndex];
    if (elem) {
      this.renderer.addClass(elem.nativeElement, 'active');
    }
  }

  removeActiveStyle() {
    if (!this.groupDivs) return;
    const divs = this.groupDivs.toArray();
    for (const div of divs) {
      this.renderer.removeClass(div.nativeElement, 'active');
    }
  }

  private styleNewGroup(divIndex: any, color: string) {
    if (!this.groupDivs) return;
    const divs = this.groupDivs.toArray();

    const elem = divs[divIndex];
    if (elem) {
      this.renderer.setStyle(elem.nativeElement, 'color', color);
    }
  }

  deleteGroup(i) {
    this.currentMergeGroupId = null;
    this.changeGroupColor(false, this.mergeGroupList[i]);
    this.mergeGroupList.splice(i, 1);
    this.currentMergeGroupId = null;
    this.removeActiveStyle();
    this.onMerge.emit(this.getMergeInfo());
  }

  send() {
    this.handleGroupWithOneCell();
    this.currentMergeGroupId = null;
    this.removeActiveStyle();
    const mi = this.getMergeInfo();
    this.onMerge.emit(mi);
  }

  /************************ */
  async onClick(cell: Cell) {
    let currentGroupBeforeClick;
    if (this.currentGroup) {
      currentGroupBeforeClick = JSON.parse(JSON.stringify(this.currentGroup));
    }
    if (this.noCurrentMergeGroup()) {
      if (this.isBelongToGroup(cell)) return;
      this.addNewGroup();
      this.addCell(cell);
      this.changeCurrentGroupColor(currentGroupBeforeClick);
      return;
    }
    if (this.isBelongToAnotherGroup(cell)) return;
    if (this.isBelongToCurrentGroup(cell)) {
      await this.handleExistCell(cell);
      this.changeCurrentGroupColor(currentGroupBeforeClick);
      return;
    }
    this.tryToComplete(cell, currentGroupBeforeClick);
  }

  private changeCurrentGroupColor(group: MGroup) {
    /** remove color from all previous cells */
    this.changeGroupColor(false, group);
    /** add color to all new cells */
    this.changeGroupColor(true, null, this.currentColor);
  }

  private changeGroupColor(hasColor: boolean, group?: MGroup, color?: string) {
    group = !group ? this.currentGroup : group;
    if (group && group.cells.length) {
      for (const cell of group.cells) {
        this.changeCellColor(cell, hasColor, color);
      }
    }
  }

  private changeCellColor(cell: Cell, hasColor: boolean, color: string) {
    if (hasColor) {
      cell = { ...cell, color };
    }
    else {
      cell = { ...cell, color: 'White' };
    }
    this.changeColorSubject.next(cell);
  }

  tryToComplete(cell: Cell, currentGroupBeforeClick: MGroup) {
    const testGroup = JSON.parse(JSON.stringify(this.currentGroup));
    this.addCell(cell, testGroup);
    if (this.isValid(testGroup)) {
      this.fillCompleteGroup(testGroup);
      this.changeCurrentGroupColor(currentGroupBeforeClick);
    }
    else {
      this.popupSv.showErrMsg('Intersection with another group');
    }
  }


  private fillCompleteGroup(testGroup: any) {
    const completeGroup = this.getCompleteGroupCells(testGroup);
    this.currentGroup.cells.splice(0);
    for (const cell of completeGroup) {
      this.currentGroup.cells.push(cell);
    }
  }

  getCompleteGroupCells(group?: MGroup): Cell[] {
    group = !group ? this.currentGroup : group;
    let cells = [];
    const minRow = this.getMinRow(group);
    const maxRow = this.getMaxRow(group);
    const minCol = this.getMinCol(group);
    const maxCol = this.getMaxCol(group);
    if (minRow !== maxRow && minCol !== maxCol) {
      for (let col = minCol; col <= maxCol; col++) {
        for (let row = minRow; row <= maxRow; row++) {
          cells.push({ row, col });
        }
      }
    }
    else if (minRow !== maxRow) {
      for (let row = minRow; row <= maxRow; row++) {
        cells.push({ row, col: minCol });
      }
    }
    else if (minCol !== maxCol) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ row: minRow, col });
      }
    }
    return cells;
  }

  isValid(testGroup: MGroup) {
    const otherGroups = this.mergeGroupList.filter(g => g.id !== this.currentMergeGroupId);
    for (const group of otherGroups) {
      const intersection = this.getIntersection(group.cells, testGroup);
      if (intersection.size > 0) {
        return false;
      }
    }
    return true;
  }

  isBelongToAnotherGroup(cell: Cell) {
    const c = this.mergeGroupList.filter(mg => mg.id !== this.currentMergeGroupId)
      .find(mg => this.groupHasCell(mg, cell));
    if (c) return true;
    return false;
  }

  getIntersection(anotherGroupCells: Cell[], testGroup: MGroup) {
    const anotherGroupSet = new Set([...anotherGroupCells.map(c => JSON.stringify(c))]);
    const completeGroupCells = this.getCompleteGroupCells(testGroup).map(c => JSON.stringify(c));
    const intersection = new Set([...completeGroupCells].filter(cell => anotherGroupSet.has(cell)));
    return intersection;
  }

  getMinCol(group?: MGroup) {
    group = !group ? this.currentGroup : group;
    const cols = group.cells.map(cell => cell.col);
    return Math.min(...cols);
  }

  getMaxCol(group?: MGroup) {
    group = !group ? this.currentGroup : group;
    const cols = group.cells.map(cell => cell.col);
    return Math.max(...cols);
  }

  getMinRow(group?: MGroup) {
    group = !group ? this.currentGroup : group;
    const rows = group.cells.map(cell => cell.row);
    return Math.min(...rows);
  }

  getMaxRow(group?: MGroup) {
    group = !group ? this.currentGroup : group;
    const rows = group.cells.map(cell => cell.row);
    return Math.max(...rows);
  }

  get currentGroup() {
    return this.mergeGroupList.find(mg => mg.id === this.currentMergeGroupId);
  }


  isBelongToGroup(cell: Cell) {
    if (this.mergeGroupList.length === 0) return false;
    const c = this.mergeGroupList.find(mg => this.groupHasCell(mg, cell));
    if (c) return true;
    return false;
  }



  isBelongToCurrentGroup(cell: Cell) {
    return this.groupHasCell(this.currentGroup, cell);
  }

  groupHasCell(group: MGroup, cell: Cell) {
    const c = group?.cells.find(c => JSON.stringify(c) === JSON.stringify(cell));
    if (c) return true;
    return false;
  }

  noCurrentMergeGroup() {
    if (this.currentMergeGroupId) return false;
    return true;
  }

  addNewGroup(cells: Cell[] = [], isFocus = true) {
    const id = uuid();
    const color = this.getColor();
    const group = {
      id,
      color,
      cells
    }
    const length = this.mergeGroupList.push(group);
    if (isFocus) {
      this.changeCurrentGroupId(id);
    }
    setTimeout(() => {
      this.styleNewGroup(length - 1, color);
      if (isFocus) {
        this.styleActiveGroup(length - 1);
      }
    }, 0);
    return {length, color};
  }

  // addNewMergeGroup() {
  //   const id = uuid();
  //   const color = this.getColor();
  //   const group = {
  //     id,
  //     color,
  //     cells: []
  //   }
  //   const length = this.mergeGroupList.push(group);
  //   this.changeCurrentGroupId(id);
  //   setTimeout(() => {
  //     this.styleNewGroup(length - 1, color);
  //     this.styleActiveGroup(length - 1);
  //   }, 0);
  // }

  addCell(cell: Cell, group?: MGroup) {
    group = !group ? this.currentGroup : group;
    if (group.cells) {
      group.cells.push(cell);
    }
  }

  get currentColor() {
    return this.currentGroup?.color;
  }

  getCellIndex(group: MGroup, cell: Cell) {
    return group.cells.findIndex(c => JSON.stringify(cell) === JSON.stringify(c));
  }

  checkTopLine(cell: Cell) {
    if (this.cellListHasCell(this.getTopLineCells(), cell)) {
      this.removeLineCells(this.getTopLineCells());
      this.resetGroup();
      return true;
    }
    return false;
  }

  checkBottomLine(cell: Cell) {
    if (this.cellListHasCell(this.getBottomLineCells(), cell)) {
      this.removeLineCells(this.getBottomLineCells());
      this.resetGroup();
      return true;
    }
    return false;
  }

  checkStartLine(cell: Cell) {
    if (this.cellListHasCell(this.getStartLineCells(), cell)) {
      this.removeLineCells(this.getStartLineCells());
      this.resetGroup();
      return true;
    }
    return false;
  }

  checkEndLine(cell: Cell) {
    if (this.cellListHasCell(this.getEndLineCells(), cell)) {
      this.removeLineCells(this.getEndLineCells());
      this.resetGroup();
      return true;
    }
    return false;
  }

  async handleExistCell(cell: Cell) {
    const cornerCount = this.getCornerCells().length;
    if (this.handleIfOneLine(cornerCount, cell)) return;
    if (await this.handleIfManyLines(cornerCount, cell)) return;
  }

  handleIfOneLine(cornerCount: number, cell: Cell) {
    if (cornerCount < 4 && this.isCornerCell(cell)) {
      this.removeCell(cell);
      this.resetGroup();
      return true;
    }
    return false;
  }


  async handleIfManyLines(cornerCount: number, cell: Cell) {
    if (cornerCount === 4) {
      if (await this.handleIfCornerCell(cell)) return true;
      if (this.checkTopLine(cell)) return true;
      if (this.checkBottomLine(cell)) return true;
      if (this.checkStartLine(cell)) return true;
      if (this.checkEndLine(cell)) return true;
    }
    return false;
  }

  async handleIfCornerCell(cell: Cell) {
    if (this.isCornerCell(cell)) {
      try {
        const horizontal = await this.popupSv.showDialog('dddd').toPromise();
        if (horizontal) {
          if (this.checkTopLine(cell)) return true;
          if (this.checkBottomLine(cell)) return true;
        }
        else {
          if (this.checkStartLine(cell)) return true;
          if (this.checkEndLine(cell)) return true;
        }
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  removeCell(cell: Cell) {
    const i = this.getCellIndex(this.currentGroup, cell);
    if (i > -1) {
      this.currentGroup.cells.splice(i, 1);
    }
  }

  removeLineCells(cells: Cell[]) {
    for (const cell of cells) {
      this.removeCell(cell);
    }
  }

  cellListHasCell(cells: Cell[], cell: Cell) {
    return cells.map(c => JSON.stringify(c)).includes(JSON.stringify(cell));
  }

  getTopLineCells() {
    const i = this.getMinRow()
    const x = this.currentGroup.cells.filter(c => c.row === this.getMinRow());
    return x
  }

  getBottomLineCells() {
    return this.currentGroup.cells.filter(c => c.row === this.getMaxRow());
  }

  getStartLineCells() {
    return this.currentGroup.cells.filter(c => c.col === this.getMinCol());
  }

  getEndLineCells() {
    return this.currentGroup.cells.filter(c => c.col === this.getMaxCol());
  }

  isCornerCell(cell: Cell) {
    return this.getCornerCells().map(c => JSON.stringify(c)).includes(JSON.stringify(cell));
  }

  getVirticalLineCells(cell: Cell) {
    return this.currentGroup.cells.filter(c => c.col === cell.col)
  }

  getHorizontalLineCells(cell: Cell) {
    return this.currentGroup.cells.filter(c => c.row === cell.row);
  }

  getCornerCells(): Cell[] {
    const cornerCellsArr = [
      { row: this.getMinRow(), col: this.getMinCol() },
      { row: this.getMinRow(), col: this.getMaxCol() },
      { row: this.getMaxRow(), col: this.getMinCol() },
      { row: this.getMaxRow(), col: this.getMaxCol() },
    ];
    const cornerCellsSet = new Set(cornerCellsArr.map(c => JSON.stringify(c)));
    return [...cornerCellsSet].map(c => JSON.parse(c));

  }

  private resetGroup(group?: MGroup) {
    group = !group ? this.currentGroup : group;
    if (group.cells.length === 0) {
      const index = this.getCurrentGroupIndex();
      if (index > -1) {
        this.mergeGroupList.splice(index, 1);
        this.currentMergeGroupId = null;
        this.onMerge.emit(this.getMergeInfo());
      }
    }
  }

  getCurrentGroupIndex() {
    return this.mergeGroupList.findIndex(mg => mg.id === this.currentMergeGroupId);
  }

  handleGroupWithOneCell() {
    let indexes = [];
    this.mergeGroupList.forEach((group, index) => {
      if (group.cells.length === 1) {
        indexes.push(index);
      }
    });
    for (const index of indexes) {
      this.changeCellColor(this.mergeGroupList[index].cells[0], false, this.currentColor);
      this.mergeGroupList.splice(index, 1);
    }
  }

  //----------------------------------------------------------------
  colorIndex = -1;
  increaseColorIndex() { this.colorIndex++; }
  getColor() {
    const colors = [
      '#3c858e', '#f66c1b', '#3c73b3', '#fddf1a', '#f5dbe2', '#c6def8', '#262626'
    ];
    if (this.colorIndex < colors.length) {
      this.increaseColorIndex();
      return colors[this.colorIndex];
    }
    else {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return `#${randomColor}`;
    }

  }

  getAllNonMergedCells() {
    const allCells = this.cellList.map(c => JSON.stringify(c));
    const mergedCells = this.getAllMergedCells().map(c => JSON.stringify(c));
    const nonMergedCells = allCells.filter(cell => !mergedCells.includes(cell)).map(cell => JSON.parse(cell));
    return nonMergedCells;
  }

  getAllMergedCells() {
    const cells = [].concat(...this.mergeGroupList.map(g => g.cells));
    return cells;
  }

  getMergeInfo(): MergeInfo[] {
    let mergeInfoList = [];
    for (const group of this.mergeGroupList) {
      mergeInfoList.push(this.getMergeGroupInfo(group));
    }
    for (const mi of this.getAllNonMergedCells()) {
      mergeInfoList.push(this.generateMergeInfoForNonMergedCell(mi));
    }
    return mergeInfoList;
  }

  generateMergeInfoForNonMergedCell(cell: Cell) {
    return {
      'grid-column': `${cell.col}/${cell.col + 1}`,
      'grid-row': `${cell.row}/${cell.row + 1}`
    };
  }

  private getMergeGroupInfo(group: MGroup) {
    let mergeInfo = {};
    const minRow = this.getMinRow(group);
    const maxRow = this.getMaxRow(group);
    const minCol = this.getMinCol(group);
    const maxCol = this.getMaxCol(group);
    if (minRow === maxRow) {
      mergeInfo = {
        'grid-column': `${minCol}/${maxCol + 1}`,
        'grid-row': `${minRow}/${maxRow + 1}`
      };
    }
    else if (minCol === maxCol) {
      mergeInfo = {
        'grid-column': `${minCol}/${maxCol + 1}`,
        'grid-row': `${minRow}/${maxRow + 1}`
      };
    }
    else {
      mergeInfo = {
        'grid-column': `${minCol}/${maxCol + 1}`,
        'grid-row': `${minRow}/${maxRow + 1}`
      };
    }
    return mergeInfo;
  }

  // private getMergeGroupInfo(group: MGroup): MergeInfo {
  //   let mergeInfo = {
  //     css: null,
  //     targetSectionIndex: null,
  //     mergedCellsCount: null
  //   };
  //   const minRow = this.getMinRow(group);
  //   const maxRow = this.getMaxRow(group);
  //   const minCol = this.getMinCol(group);
  //   const maxCol = this.getMaxCol(group);
  //   const length = group.cells.length;
  //   mergeInfo.mergedCellsCount = length;
  //   if (minRow === maxRow) {
  //     mergeInfo.css = {
  //       'grid-column': `${minCol}/${maxCol + 1}`,
  //       'grid-row': `${minRow}/${maxRow + 1}`
  //     };
  //   }
  //   else if (minCol === maxCol) {
  //     mergeInfo.css = {
  //       'grid-column': `${minCol}/${maxCol + 1}`,
  //       'grid-row': `${minRow}/${maxRow + 1}`
  //     };
  //   }
  //   else {
  //     mergeInfo.css = {
  //       'grid-column': `${minCol}/${maxCol + 1}`,
  //       'grid-row': `${minRow}/${maxRow + 1}`
  //     };
  //   }
  //   const cell = { row: minRow, col: minCol };
  //   const targetSectionIndex = this.cellList.findIndex(c => JSON.stringify(c) === JSON.stringify(cell));
  //   mergeInfo.targetSectionIndex = targetSectionIndex;
  //   return mergeInfo;
  // }

}
