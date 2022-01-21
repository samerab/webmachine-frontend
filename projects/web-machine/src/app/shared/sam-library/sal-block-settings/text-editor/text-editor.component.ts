import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '../../sal-page/services/page.service';
import { BlockSettingsService } from '../block-settings.service';
import { FormControl } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { FontService } from '../../sal-common/font.service';
import { MatSelect } from '@angular/material/select';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { ResultsPopupComponent } from '../../sal-popup/resultsPopup/resultsPopup.component';
import { PopupService } from '../../sal-popup';
import { StyleInfoService } from './services/style-info.service';
import { PartsService } from './services/parts.service';
import { SelectionService } from './services/selection.service';
import { ElementsService } from './services/elements.service';
import { LineHeightInfo } from './line-height/line-height.component';

@Component({
  selector: 'ws-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('content') content: ElementRef<HTMLDivElement>;
  @ViewChild('colorBox') colorBox: ElementRef<HTMLInputElement>;
  @ViewChild('bgColorBox') bgColorBox: ElementRef<HTMLInputElement>;
  @ViewChild('select') select: MatSelect;
  @ViewChild('autoCompleteInput') autoCompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autoComplete: MatAutocompleteTrigger;
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('addLinkTemplate') addLinkTemplate: TemplateRef<any>;
  @ViewChild('lineHeightTemplate') lineHeightTemplate: TemplateRef<any>;

  _range: Range;
  get range() { return this._range };
  set range(val) {
    this._range = val;
    this.selectionSv.setRange(val)
  }

  _container: HTMLDivElement;
  get container() { return this._container };
  set container(val) {
    this._container = val;
    this.selectionSv.setContainer(val);
    this.elementsSv.setContainer(val);
    this.partsSv.setContainer(val)
  }

  _lineHeight;
  get lineHeight() { return this._lineHeight };
  set lineHeight(val) {
    this._lineHeight = val;
    this.elementsSv.setLineHeight(val)
  }

  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  fontSizeControl: FormControl = new FormControl();
  currentAlignDiv
  fonts;
  selectionType;
  isFullscreen = false;
  isFormatPainting = false;
  formatToPaint;
  isEdited = false;
  fontSizeList = [10, 14, 16, 18, 20, 24, 30, 36, 48];
  unicodeList = ['&#8226;', '&#9658;', '&#9632;', '&#8727;', '&#9002;', '&#8883;', '&#9989;']
  setting = {
    id: 'anchor',
    category: '',
    value: {
      color: 'rgb(0,0,255)',
      underline: true
    }
  }

  constructor(
    private settingsSv: BlockSettingsService,
    private router: Router,
    private pageSv: PageService,
    private renderer: Renderer2,
    private fontSv: FontService,
    private popupSv: PopupService,
    private styleInfoSv: StyleInfoService,
    private partsSv: PartsService,
    private selectionSv: SelectionService,
    private elementsSv: ElementsService
  ) { }

  ngOnInit(): void {
    this.onFontSizeChange();
    this.setFonts();
  }
  ngAfterViewInit(): void {
    this.setSavedSettings();
    this.container = this.content.nativeElement;
    this.styleInfoSv.setModifyElements();
  }

  openLineHeightPopup() {
    this.selectionSv.saveRange();
    const config = {
      width: '500px',
      height: '280px',
      position: { top: '200px' },
      disableClose: true
    }
    this.dialogRef = this.popupSv.openPopup1(this.lineHeightTemplate, null, config);
  }

  closeLineHeightPopup(lineHeightInfo: LineHeightInfo) {
    this.dialogRef.close();
    this.container.focus();
    this.selectionSv.restoreRange();
    if (lineHeightInfo
      && [undefined, 'apply'].includes(lineHeightInfo.clickedBtn)
      && lineHeightInfo.lineHeight
    ) {
      this.exec('handleLineHeight', lineHeightInfo.lineHeight)
    }
  }

  openLinkPopup() {
    this.selectionSv.saveRange();
    const config = {
      width: '500px',
      height: '280px',
      position: { top: '200px' },
      disableClose: true
    }
    this.dialogRef = this.popupSv.openPopup1(this.addLinkTemplate, null, config);
  }
  onLinkApply(link: string) {
    this.dialogRef.close();
    this.container.focus();
    this.selectionSv.restoreRange();
    if (link) {
      this.addLink(link);
      this.sendChanges()
    }
  }

  openUnicodeList() {
    this.selectionSv.saveRange();
    const top = (this.getPos().top + this.getPos().height).toString() + 'px';
    const left = this.getPos().left.toString() + 'px';
    const config = {
      width: '390px',
      height: '280px',
      position: { top, left },
      disableClose: true
    }
    this.dialogRef = this.popupSv.openPopup1(this.template, null, config);
  }

  closeUnicodePopup(unicode) {
    this.container.focus();
    this.selectionSv.restoreRange();
    if (unicode) {
      this.exec('tryToInsertLi', unicode)
    }
    this.dialogRef.close()
  }

  getPos(): ClientRect | DOMRect {
    const listBtn = document.getElementById('listBtn');
    return listBtn.getBoundingClientRect()
  }

  setFonts() {
    this.fonts = this.fontSv.getFonts()
  }

  onFontSelect(font) {
    this.exec('modifyStyle', 'font-family', font.value)
  }

  onColor(e: Event) {
    this.exec('modifyStyle', 'color', (e?.target as HTMLInputElement)?.value)
  }

  onBgColor(e: Event) {
    this.exec('modifyStyle', 'backgroundColor', (<HTMLInputElement>(e?.target))?.value)
  }

  exec(command: string, ...context) {
    const selectionType = window.getSelection().type;
    if (selectionType === 'Caret') {
      const pre = this.partsSv.getPreviousBr();
      if (!pre) {
        this.selectionSv.moveCaretAfter('start-br')
      }
    }
    this.elementsSv.checkMainBrs();
    this.runCommand(command, context);
    this.sendChanges()
  }

  private runCommand(command: string, context: any[]) {
    switch (command) {
      case 'select':
        this.onClick();
        break;
      case 'modifyStyle':
        this.modifyStyle(context[0], context[1]);
        break;
      case 'align':
        this.align(context[0]);
        break;
      case 'addLink':
        this.openLinkPopup();
        break;
      case 'removeLink':
        this.removeAnchor();
        break;
      case 'tryToInsertLi':
        this.tryToInsertLi(context[0]);
        break;
      case 'handleIndent':
        this.handleIndent(context[0]);
        break;
      case 'paintFormat':
        this.isFormatPainting = true;
        break;
      case 'enter':
        const alingDivId = this.partsSv.getAlignDiv() ?.id;
        this.onEnter(alingDivId);
        break;
      case 'handleLineHeight':
        this.handleLineHeight(context[0]);
        break;
      case 'clearStyle':
        this.clearStyle();
        break;
    }
  }

  @HostListener('document:selectionchange', ['$event'])
  onSelectionchange(e) {
    this.setRange();
  }

  private setRange() {
    const info = this.selectionSv.getRangeInfo(true);
    if (info) {
      const { range, selectionType } = info;
      this.range = range;
      this.selectionType = selectionType
    }
  }

  saveFormat() {
    const selType = window.getSelection().type;
    if (selType === 'Range') {
      const selectionInfo = this.selectionSv.getSelectionInfo(this.range);
      if (['div', 'a', 'text'].includes(selectionInfo.type)) {
        const parent = selectionInfo.parent;
        const style = parent.getAttribute('style');
        this.formatToPaint = style;
        return
      }
      if (selectionInfo.type === 'multiInOneLine') {
        const alignDiv = this.getElementById(selectionInfo.alignDivId);
        this.formatToPaint = this.styleInfoSv.extractStyleFromFirstChild(alignDiv);
        return
      }
      if (selectionInfo.type === 'multiLines') {
        const children = this.partsSv.getChildren(this.range);
        this.formatToPaint = this.styleInfoSv.extractStyleFromFirstChild(children[0] as HTMLElement)
        return
      }
    }
  }

  paintFormat() {
    this.modifyStyle(null, null, this.formatToPaint);
    this.isFormatPainting = false
  }

  handlePaintFormat() {
    if (this.isFormatPainting) {
      this.paintFormat()
    }
    else {
      this.saveFormat()
    }
  }

  onClick() {
    this.handlePaintFormat();
    const parts = this.partsSv.getPartsFromStartToCaretPosition();
    if (parts.length === 0) {
      this.selectionSv.moveCaretAfter('start-br')
    }
    this.styleInfoSv.setInfo(this.fontSizeControl, this.select)
  }

  align(position: string) {
    switch (position) {
      case 'center':
        this.handleAlignment('text-align', 'center')
        break;
      case 'left':
        this.handleAlignment('text-align', 'left')
        break; case 'right':
        this.handleAlignment('text-align', 'right')
        break;
    }
  }

  handleAlignment(name, value) {
    const selectionType = window.getSelection().type;
    if (selectionType === 'Caret') {
      this.alignOne(name, value)
    }
    else if (selectionType === 'Range') {
      this.alignMany(name, value)
    }
  }

  private alignMany(name: any, value: any) {
    const alignList = this.partsSv.getAlignDivList(this.range);
    this.removeManyIndent(alignList);
    for (const align of alignList) {
      if (align) {
        this.renderer.setStyle(align, name, value);
      }
    }
  }

  private alignOne(name: any, value: any) {
    const align = this.partsSv.getAlignDiv();
    if (align) {
      this.removeOneIndent(align)
      this.renderer.setStyle(align, name, value);
    }
  }

  handleIndent(increase: boolean) {
    const selectionType = window.getSelection().type;
    if (selectionType === 'Caret') {
      const alignDiv = this.partsSv.getAlignDiv();
      this.handleOneIndent(alignDiv, increase)
    }
    else if (selectionType === 'Range') {
      this.handleManyIndent(increase)
    }
  }

  handleManyIndent(increase: boolean) {
    const alingDivList = this.partsSv.getAlignDivList(this.range);
    for (const alignDiv of alingDivList) {
      this.handleOneIndent(alignDiv, increase)
    }
  }

  handleOneIndent(alignDiv, increase: boolean) {
    if (alignDiv) {
      let indent = this.getIndent(alignDiv, increase);
      this.renderer.setStyle(alignDiv, 'marginLeft', indent)
    }
  }

  removeOneIndent(alignDiv) {
    if (alignDiv) {
      this.renderer.setStyle(alignDiv, 'marginLeft', 0)
    }
  }

  removeManyIndent(alingDivList) {
    for (const alignDiv of alingDivList) {
      this.removeOneIndent(alignDiv)
    }
  }

  private getIndent(alignDiv: HTMLElement, increase: boolean) {
    let indent;
    const mLeft = this.styleInfoSv.extractStyle(alignDiv, 'margin-left');
    let val = 0;
    if (mLeft) {
      val = Number(mLeft.slice(0, -2));
    }
    if (increase) {
      indent = `${val + 20}px`;
    }
    else {
      const tryVal = val - 20;
      indent = tryVal < 0 ? 0 : `${tryVal}px`;
    }
    return indent;
  }

  fixAll() {
    this.elementsSv.checkMainBrs();
    const brList = Array.from(this.container.querySelectorAll('br'));
    for (const br of brList) {
      this.handleAlignDiv(br);
    }
  }

  fixAlignDivChildren(alignDiv: ChildNode) {
    const { range } = this.selectionSv.getRangeInfo();
    const children = Array.from(alignDiv.childNodes).filter(child => {
      return !(child.nodeName === '#text' && child.nodeValue === '')
    });
    for (const child of children) {
      if (child.nodeName === '#text') {
        range.selectNodeContents(child);
        const div = this.elementsSv.createElement('div');
        range.surroundContents(div);
      }
    }
  }

  handleAlignDiv(br?) {
    let previousBr = br ? br : this.partsSv.getPreviousBr();
    if (!previousBr) return;
    const nextSibling = previousBr.nextSibling;
    if (!nextSibling) {
      return null
    }
    if (nextSibling && nextSibling.nodeName === 'DIV' && nextSibling['id'].startsWith('align')) {
      this.fixAlignDivChildren(nextSibling);
      return nextSibling['id']
    }
    if (nextSibling && nextSibling.nodeName === 'BR') {
      return null
    }
    const { range } = this.selectionSv.getRangeInfo();
    range.setStartAfter(previousBr);
    range.setEndAfter(nextSibling);
    const con = range.extractContents().textContent;
    if (con === '') {
      return null
    }
    const div = this.elementsSv.createElement('div', con);
    const alignDiv = this.elementsSv.createAlignDiv();
    alignDiv.appendChild(div);
    range.insertNode(alignDiv);
    return alignDiv.id
  }

  private addNewLine(alignDivId?: string) {
    const { range } = this.selectionSv.getRangeInfo();
    range.collapse(false);
    let after;
    if (alignDivId) {
      const alignDiv = this.container.querySelector(`[id='${alignDivId}']`);
      after = alignDiv
    }
    else {
      const previousBr = this.partsSv.getPreviousBr();
      const next = previousBr.nextSibling;
      if (next && next.nodeName === '#text') {
        after = next
      }
      else {
        after = previousBr
      }
    }
    range.setStartAfter(after);
    const br = this.elementsSv.createElement('br');
    range.insertNode(br);
    this.selectionSv.moveCaretAfter(br.id)
    return br;
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        break;
      case 'Backspace':
        this.elementsSv.removeBlankTags();
        break;
      default:
        break;
    }
  }

  onMouseMove() {
    if (this.isEdited) {
      this.fixAll();
      this.isEdited = false
    }
  }

  onKeyup(event: KeyboardEvent) {
    this.isEdited = true;
    switch (event.code) {
      case 'Enter':
        event.preventDefault();
        this.exec('enter')
        break;
      case 'Backspace':
        this.elementsSv.removeBlankTags();
        break;
    }
    this.sendChanges()
  }

  tryToInsertLi(unicode) {
    const alignDivList = this.partsSv.getAlignDivList(this.range);
    if (alignDivList.length === 0) {
      this.insertLi(unicode)
    }
    else {
      for (const alignDiv of alignDivList) {
        this.surroundLi(alignDiv, unicode)
      }
    }
  }

  handleLi() {
    const li = this.getListItem();
    if (!li) return false;
    this.addNewLine(li.id);
    const unicode = li.textContent.substring(0, 1);
    this.insertLi(unicode);
    return true
  }

  getListItem() {
    const alignDiv = this.partsSv.getAlignDiv();
    if (alignDiv ?.id.startsWith('align:li')) {
      return alignDiv
    }
    return null
  }

  isAlignDivLi(alignDiv: HTMLElement) {
    if (alignDiv ?.id.startsWith('align:li')) {
      return true
    }
    return false
  }

  insertLi(unicode: string) {
    const previousBr = this.partsSv.getPreviousBr();
    const next = previousBr ?.nextElementSibling;
    if (next) {
      const alignDiv = this.elementsSv.createAlignDiv(null, null, null, 'li');
      const div = this.elementsSv.createElement('div', `${unicode}&nbsp;&nbsp;`);
      this.renderer.appendChild(alignDiv, div);
      this.container.insertBefore(alignDiv, next);
      this.selectionSv.moveCaret(div.firstChild, 3)
    }
  }

  surroundLi(alignDiv: HTMLElement, unicode: string) {
    if (this.isAlignDivLi(alignDiv)) {
      const first = alignDiv.firstElementChild;
      const text = unicode + first.textContent.slice(1);
      first.innerHTML = text;
    }
    else {
      this.renderer.setAttribute(alignDiv, 'id', `align:li-${uuid()}`)
      const div = this.elementsSv.createElement('div', `${unicode}&nbsp;&nbsp;`);
      this.renderer.insertBefore(alignDiv, div, alignDiv.firstChild);
    }
    this.selectionSv.moveCaretAfter(alignDiv.lastElementChild.id)
  }

  private onEnter(id) {
    if (this.handleLi()) return;
    const { range } = this.selectionSv.getRangeInfo();
    const currentAlignDiv = this.partsSv.getAlignDiv();
    if (!currentAlignDiv) {
      this.addNewLine(id);
      return
    }
    range.collapse(true);
    range.setEndAfter(currentAlignDiv.lastChild);
    const content = range.extractContents();
    const children = Array.from(content.childNodes);
    if (children.length === 1 && children[0].textContent === '') {
      this.addNewLine(id);
    }
    else {
      const alignDiv = this.elementsSv.createAlignDiv();
      for (const child of children) {
        alignDiv.appendChild(child);
      }
      const br = this.elementsSv.createElement('br');
      this.container.insertBefore(br, currentAlignDiv.nextSibling);
      this.container.insertBefore(alignDiv, br.nextSibling);
      this.selectionSv.moveCaretAfter(alignDiv.id)
    }
  }

  private setSavedSettings() {
    this.settingsSv.savedBlockSettings$
      .subscribe(settingsData => this.content.nativeElement.innerHTML = settingsData.settings ?.html);
  }

  onFontSizeChange() {
    this.fontSizeControl.valueChanges
      .subscribe(val => {
        if (this.fontSizeList.includes(val)) {
          this.exec('modifyStyle', 'fontSize', val + 'px')
        }
        else if (val > 10) {
          this.exec('modifyStyle', 'fontSize', val + 'px')
          this.autoCompleteInput.nativeElement.blur()
          this.autoComplete.closePanel()
        }
      })
  }

  triggerColorBox() {
    this.colorBox.nativeElement.click()
  }

  triggerBgColorBox() {
    this.bgColorBox.nativeElement.click()
  }

  modifyStyle(style: string, value: string, fullStyle?: string) {
    if (this.selectionType === 'Caret') {
      /** TO DO: show message */
      return
    }
    else if (this.selectionType === 'Range') {
      if (this.range) {
        let stl = fullStyle;
        if (!fullStyle) {
          stl = `${style}:${value};`
        }
        this.modify(this.range, stl)
      }
    }
  }

  modify(range: Range, style, isRemoveLink?: boolean) {
    const partList = this.partsSv.getChildren(range);
    const selectionInfo = this.selectionSv.getSelectionInfo(range);
    let elements = this.elementsSv.getElements(selectionInfo, partList, style);
    if (elements && elements.length > 0) {
      if (isRemoveLink) {
        elements = this.elementsSv.changeElements(elements, selectionInfo)
      }
      const reversedElems = elements.slice().reverse();
      if (selectionInfo.type === 'multiLines') {
        range.deleteContents();
        const alignDivs = partList.filter(part => part.nodeName === 'DIV')
        const lastAlignDivId = alignDivs[alignDivs.length - 1]['id']
        this.elementsSv.handle(elements, lastAlignDivId)
      }
      else {
        this.elementsSv.insertElements(range, reversedElems);
        this.elementsSv.moveElemets(elements);
      }
      this.elementsSv.removeBlankTags();
      setTimeout(() => {
        this.selectionSv.reselect(elements, selectionInfo);
      }, 0);
    }
  }

  removeAnchor() {
    this.modify(this.range, 'text-decoration: none;color: #000000', true)
  }

  modifyAnchor(range: Range, href, target) {
    const partList = this.partsSv.getChildren(range);
    const selectionInfo = this.selectionSv.getSelectionInfo(range);
    const elements = this.elementsSv.getAnchors(selectionInfo, partList, href, target);
    if (elements && elements.length > 0) {
      if (selectionInfo.type === 'multiLines') {
        this.setDefaultAnchorSettings(elements, true);
        range.deleteContents();
        const alignDivs = partList.filter(part => part.nodeName === 'DIV')
        const lastAlignDivId = alignDivs[alignDivs.length - 1]['id']
        this.elementsSv.handle(elements, lastAlignDivId)
      }
      else {
        this.setDefaultAnchorSettings(elements);
        const reversedElems = elements.slice().reverse();
        this.elementsSv.insertElements(range, reversedElems);
        this.elementsSv.moveElemets(elements);
      }
      this.elementsSv.removeBlankTags();
      setTimeout(() => {
        this.selectionSv.reselect(elements, selectionInfo);
      }, 0);
    }
  }

  handleLineHeight(height: number) {
    this.lineHeight = height
    const selectionType = window.getSelection().type;
    if (selectionType === 'Caret') {
      const align = this.partsSv.getAlignDiv();
      if (align) {
        this.renderer.setStyle(align, 'line-height', height);
      }
    }
    else if (selectionType === 'Range') {
      const alignList = this.partsSv.getAlignDivList(this.range);
      for (const align of alignList) {
        this.renderer.setStyle(align, 'line-height', height);
      }
    }
    // if (!this.lineHeight) {
    //   this.lineHeight = height
    // }
  }

  private setDefaultAnchorSettings(elements: any[], multiLines?: boolean) {
    for (const element of elements) {
      if (multiLines) {
        if (element['alignDivChildren']) {
          for (const elem of element['alignDivChildren']) {
            this.setAnchorStyle(elem);
          }
        }
      }
      else {
        this.setAnchorStyle(element);
      }
    }
  }

  private setAnchorStyle(element: any) {
    this.renderer.setStyle(element, 'color', this.setting.value.color);
    if (this.setting.value.underline) {
      this.renderer.setStyle(element, 'text-decoration', 'underline');
    }
    else {
      this.renderer.setStyle(element, 'text-decoration', 'none');
    }
  }

  getElementById(id: string): HTMLElement {
    return this.partsSv.getElementById(id)
  }

  clearStyle() {
    if (!this.range || this.selectionType === 'Caret') return;
    this.modify(this.range, null);
    this.styleInfoSv.resetModifyElements(this.fontSizeControl, this.select);
  }

  addLink(link: string, target = '_blank') {
    this.modifyAnchor(this.range, link, target)
  }

  /** save changes to TextComponent */
  sendChanges() {
    this.settingsSv.send({ html: this.content.nativeElement.innerHTML });
  }

  /** send changes to be recieved from TextEditorComponent */
  resendChanges() {
    this.elementsSv.removeMainBrs();
    this.pageSv.setBlockSettingsSubject.next({
      sender: 'block',
      settings: { html: this.content.nativeElement.innerHTML }
    });
  }

  openFullscreen() {
    this.isFullscreen = true;
    this.closeOutlet();
    this.router.navigate([{ outlets: { blockSettings: `block-settings/text/fullscreen` } }]);
  }

  closeFullscreen() {
    this.isFullscreen = false;
    this.sendChanges();
    this.resendChanges();
    this.closeOutlet();
    setTimeout(() => {
      this.router.navigate([{ outlets: { blockSettings: `block-settings/text` } }]);
      /** reload changes */
      this.setSavedSettings();
    }, 0);
  }

  private closeOutlet() {
    this.router.navigate([{
      outlets: {
        style: null,
        blockSettings: null,
      }
    }]);
    //this.pageSv.closeAuxOutletSubject.next();
  }

}
