import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  private container:HTMLDivElement;

  constructor() { }

  setContainer(container:HTMLDivElement) {
    this.container = container
  }

  getPartsFromStartToCaretPosition(): ChildNode[] {
    const range = window.getSelection().getRangeAt(0).cloneRange();
    range.collapse(false);
    range.setStart(this.container, 0);
    const content = range.cloneContents();
    const parts = Array.from(content.childNodes);
    const noBlankParts = parts
      .filter(child => {
        if (child.nodeName === '#text' && child.nodeValue === '') {
          return false
        }
        return true
      })
    return noBlankParts
  }

  getBrList() {
    const parts = this.getPartsFromStartToCaretPosition();
    const brList = parts.filter(child => child.nodeName === 'BR');
    return brList as HTMLBRElement[]
  }

  getPreviousBr() {
    const brList = this.getBrList();
    if (brList && brList.length > 0) {
      const preBr = brList[brList.length - 1];
      const preBrInDom = this.getElementById(preBr.id)
      return preBrInDom
    }
    return null
  }

  getAlignDiv(): HTMLElement {
    const preBr = this.getPreviousBr();
    const next = preBr ?.nextElementSibling;
    if (next && next.nodeName === 'DIV' && next['id'].startsWith('align')) {
      const nextInDom = this.getElementById(next['id'])
      return nextInDom as HTMLElement
    }
    return null
  }

  getAlignDivList(range: Range) {
    const selectionType = window.getSelection().type;
    if (selectionType === 'Caret') {
      const aDiv = this.getAlignDiv();
      return aDiv ? [aDiv] : []
    }
    else if (selectionType === 'Range') {
      const parts = this.getChildren(range);
      if (parts.length === 1 && parts[0].nodeName === '#text') {
        const aDiv = this.getAlignDiv();
        return aDiv ? [aDiv] : []
      }
      const list = parts.filter(part => part.nodeName === 'DIV' && part['id'].startsWith('align'));
      return list.map(aDiv => this.getElementById(aDiv['id']))
    }
    return null
  }

  getChildren(range: Range) {
    if (!range) return null;
    const childList = Array.from(range.cloneContents().childNodes);
    const partList = childList
      .filter(child => {
        if (child.nodeName === '#text' && child.nodeValue === '') {
          return false
        }
        if (child.nodeName === 'BR' && child['id'] === 'start-br') {
          const startBr = this.container.querySelector(`[id='start-br']`);
          if (startBr) {
            range.setStartAfter(startBr)
          }
          return false
        }
        return true
      })
    return partList
  }

  getElementById(id: string): HTMLElement {
    return this.container.querySelector(`[id='${id}']`)
  }

}
