import { Injectable } from '@angular/core';

interface Line {
  type: string;
  alignDivId: string;
  alignDivChildren: HTMLElement[];
  alignDivStyle: string;
}

export interface SelectionInfo {
  type: string;
  parent: HTMLElement;
  alignDivId?: string;
}


@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  private container:HTMLDivElement;
  private range: Range

  constructor() { }

  setContainer(container:HTMLDivElement) {
    this.container = container
  }

  setRange(range: Range) {
    this.range = range
  }

  saveRange() {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      this.range = sel.getRangeAt(0).cloneRange();
    }
  }

  restoreRange() {
    if (this.range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.range)
    }
  }

  restoreSelection(range: Range) {
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  reselect(elements: HTMLElement[], selectionInfo: SelectionInfo) {
    if (elements.length && elements.length > 0) {
      const newRange = new Range();
      if (selectionInfo.type === 'multiLines') {
        const elementsNoBr = elements.filter(elem => elem['type'] === 'line')
        const startChildren = elementsNoBr[0]['alignDivChildren'];
        const start = this.getElementById(startChildren[0].id);
        const lastChildren = elementsNoBr[elementsNoBr.length - 1]['alignDivChildren'];
        const lastChildrenReverse = lastChildren.reverse();
        const end = this.getElementById(lastChildrenReverse[lastChildrenReverse.length - 1].id);
        newRange.setStartBefore(start);
        newRange.setEndAfter(end);
      }
      else {
        const start = this.getElementById(elements[0].id);
        const end = this.getElementById(elements[elements.length - 1].id);
        if (start instanceof Node) {
          newRange.setStartBefore(start);
        }
        if (end instanceof Node) {
          newRange.setEndAfter(end);
        }
      }
      this.restoreSelection(newRange);
    }
  }

  /**
   * range.commonAncestorContainer has two options only: text | div.content
   * when range.commonAncestorContainer is div.content then 
   * multiselect and thus all part types is known in the partList that comes
   * from range.extractContents().childNodes : a text div img...
  */
  getSelectionInfo(range: Range): SelectionInfo {
    const commonAncestorContainer = range.commonAncestorContainer;
    if (!commonAncestorContainer) return null;
    let type,
      parent,
      alignDivId;
    if (commonAncestorContainer.nodeName === '#text') {
      parent = commonAncestorContainer.parentElement;
      const parentNodeName = parent.nodeName;
      if (parentNodeName === 'DIV') {
        if (parent.id === 'content') {
          type = 'text'
        }
        else {
          type = 'div'
        }
      }
      else if (parentNodeName === 'A') {
        type = 'a'
      }

    }
    else if (commonAncestorContainer.nodeName === 'DIV') {
      const id = (commonAncestorContainer as HTMLElement).id
      if (id.startsWith('align')) {
        type = 'multiInOneLine';
        alignDivId = id
      }
      else if (id === 'content') {
        type = 'multiLines';
      }
    }
    return {
      type,
      parent,
      alignDivId
    }
  }

  moveCaretAfter(elementId: string) {
    const { selection, range } = this.getRangeInfo();
    const element = this.container.querySelector(`[id='${elementId}']`) as HTMLElement;
    if (element) {
      range.setStartAfter(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  moveCaret(node: Node, offset: number) {
    const sel = window.getSelection();
    const newRange = new Range();
    newRange.setStart(node, offset);
    newRange.collapse(false);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  getRangeInfo(byEvent?: boolean) {
    const selection = window.getSelection();
    if (selection.type !== 'None' && selection.getRangeAt && selection.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange();
      if (range) {
        const info = {
          range,
          selection,
          selectionType: selection.type
        }
        const rangeStr = range.toString();
        if (byEvent && rangeStr === '') {
          return null;
        }
        return info
      }
    }
    return null
  }

  getElementById(id: string): HTMLElement {
    return this.container.querySelector(`[id='${id}']`)
  }


}
