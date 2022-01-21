import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { SelectionInfo } from './selection.service';


@Injectable({
  providedIn: 'root'
})
export class ElementsService {

  private renderer: Renderer2;
  private container:HTMLDivElement;
  private lineHeight: number;
  
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setContainer(container:HTMLDivElement) {
    this.container = container
  }

  setLineHeight(height: number) {
    this.lineHeight = height
  }

  checkMainBrs() {
    const parts = Array.from(this.container.childNodes);
    const startBrId = parts.findIndex(part => part.nodeName === 'BR' && part['id'] === 'start-br');
    if (startBrId > -1) {
      if (startBrId !== 0) {
        const startBr = this.container.querySelector('#start-br');
        startBr.setAttribute('id', uuid());
        this.addStartBr()
      }
    }
    else {
      this.addStartBr()
    }
    const endBr = this.container.querySelector('#anchor-br')
    if (!endBr)
      this.addAnchorBr()
  }

  addStartBr() {
    const startBr = this.createElement('br', null, null, null, 'start-br');
    this.renderer.insertBefore(this.container, startBr, this.container.firstChild);
  }

  addAnchorBr() {
    const anchorBr = this.createElement('br', null, null, null, 'anchor-br');
    this.renderer.appendChild(this.container, anchorBr);
  }

  removeMainBrs() {
    const startBr = this.getElementById('start-br');
    if (startBr) {
      this.renderer.removeChild(this.container, startBr);
    }
  }

  moveElemets(elements: HTMLElement[]) {
    for (const element of elements) {
      const elem = this.container.querySelector(`[id='${element.id}']`)
      if (!elem ?.parentElement || elem ?.parentElement ?.id ?.startsWith('align')) {
        continue
      }
      this.moveChildren(elem.parentElement)
    }
  }

  moveChildren(parent) {
    if (!parent) {
      return
    }
    let children = this.getChildElements(parent);
    this.moveChildElements(parent, children);
  }

  private getChildElements(parent: HTMLElement): HTMLElement[] {
    let children = [];
    let parentStyle = parent.getAttribute('style');
    const childList = Array.from(parent.childNodes);
    for (const child of childList) {
      if (child.nodeName === '#text') {
        if (child.nodeValue !== '') {
          const type = this.getElementType(parent, child);
          let elem;
          if (type === 'a') {
            elem = this.createAnchorFromParent(child.nodeValue, parent, parentStyle)
          }
          else {
            elem = this.createElement(type, child.nodeValue, null, parentStyle);
          }
          children.push(elem);
        }
        else { continue }
      }
      else {
        children.push(child);
      }
    }
    return children;
  }

  getElementType(parent, child) {
    let type;
    if (child.nodeName === '#text') {
      if (parent.nodeName === 'DIV') {
        type = 'div'
      }
      else if (parent.nodeName === 'A') {
        type = 'a'
      }
    }
    return type
  }

  private moveChildElements(parent: HTMLElement, children: HTMLElement[]) {
    const host = parent.parentElement.id.startsWith('align')
      ? parent.parentElement
      : this.container;
    for (const child of children) {
      const parentElem = this.container.querySelector(`[id='${parent.id}']`);
      if (parentElem) {
        host.insertBefore(child, parentElem);
      }
    }
    parent.textContent = '';
    this.removeBlankTags()
  }

  removeBlankTags() {
    this.container.querySelectorAll('*').forEach(elem => {
      if (elem.nodeName !== 'BR' && !elem.id.startsWith('align-')) {
        if (elem.textContent === '' || /^\s+$/.test(elem.textContent)) {
          elem.remove()
        }
      }
    })
  }

  getElements(selectionInfo: SelectionInfo, partList: ChildNode[], newStyle: string) {
    if (!(partList && partList.length && partList.length > 0)) return null;
    let elements: HTMLElement[] = [];
    const parentStyle = selectionInfo.parent ?.getAttribute('style');
    switch (selectionInfo.type) {
      case 'text':
        const div = this.createElement('div', partList[0].nodeValue, null, newStyle);
        elements.push(div)
        break;
      case 'div':
        const newDiv = this.createElement('div', partList[0].nodeValue, parentStyle, newStyle);
        elements.push(newDiv)
        break;
      case 'a':
        const a = this.createAnchorFromParent(partList[0].nodeValue, selectionInfo.parent, newStyle);
        elements.push(a)
        break;
      case 'multiInOneLine':
        elements = [...this.getMultiElementsOneLine(partList, newStyle)]
        break;
      case 'multiLines':
        elements = [...this.getMultiElements(partList, newStyle)]
        break;
    }
    return elements
  }

  getMultiElementsOneLine(partList, newStyle) {
    const elements = partList.map(part => {
      return this.getElementInOneLine(part, newStyle)
    })
    return elements
  }

  getElementInOneLine(part: ChildNode, newStyle) {
    if (part.nodeName === 'DIV') {
      const partAsElement = part as HTMLElement;
      const parentStyle = partAsElement.getAttribute('style');
      return this.createElement('div', part.textContent, parentStyle, newStyle);
    }
    else if (part.nodeName === 'A') {
      return this.createAnchorFromParent(part.textContent, part as HTMLAnchorElement, newStyle)
    }
    return null
  }

  getMultiElements(partList: ChildNode[], newStyle) {
    let elements = [];
    for (const part of partList) {
      if (part.nodeName === 'BR') {
        elements.push({ type: 'br', });
        continue
      }
      const list = this.getElementList(part, newStyle);
      const line = {
        type: 'line',
        alignDivId: part['id'],
        alignDivChildren: list,
        alignDivStyle: (part as HTMLElement).getAttribute('style')
      }
      elements.push(line);
    }
    return elements
  }

  getElementList(part: ChildNode, newStyle): HTMLElement[] {
    const elementList = [];
    if (part.nodeName === 'DIV') {
      const childList = Array.from(part.childNodes);
      for (const child of childList) {
        const childElem = child as HTMLElement;
        const parentStyle = childElem.getAttribute('style');
        let type;
        if (childElem.nodeName === 'DIV') {
          type = 'div'
        }
        else if (childElem.nodeName === 'A') {
          type = 'a'
        }
        let newElem;
        if (type === 'div') {
          newElem = this.createElement('div', child.textContent, parentStyle, newStyle);
        }
        else if (type === 'a') {
          const href = childElem.getAttribute('href');
          const target = childElem.getAttribute('target');
          newElem = this.createAnchor(child.textContent, href, target, parentStyle, newStyle);
        }
        elementList.push(newElem)
      }
    }
    else if (part.nodeName === 'BR') {
      const newElem = this.createElement('br');
      elementList.push(newElem)
    }
    else if (part.nodeName === 'A') {
      const newElem = this.createAnchorFromParent(part.textContent, part as HTMLAnchorElement, newStyle);
      elementList.push(newElem)
    }
    return elementList
  }

  createAlignDiv(styleName?, styleValue?, fullStyle?, id?: string, fullId?: string) {
    const lineHeight = this.lineHeight || 1;
    let style = `display: inline-block;width: 100%;line-height: ${lineHeight}`;
    if (styleName && styleValue) {
      style += `${styleName}: ${styleValue};`
    }
    if (fullStyle) {
      style += fullStyle
    }
    let preId;
    if (fullId) {
      preId = fullId
    }
    else {
      const uId = uuid();
      preId = id ? `align:${id}-${uId}` : `align-${uId}`
    }
    const alignDiv = this.createElement(
      'div',
      '',
      null,
      style,
      preId
    );
    return alignDiv
  }

  handle(lines: HTMLElement[], lastAlignDivId: string) {
    let lastBr;
    let lastAlignDiv;
    for (const line of lines) {
      if (line['type'] === 'line') {
        lastAlignDiv = this.insertDiv(line, lastAlignDivId, lastBr);
      }
      else if (line['type'] === 'br') {
        if (lastAlignDiv) {
          lastBr = this.insertBr(lastAlignDiv);
        }
      }
    }
  }

  insertElements(range: Range, elements: HTMLElement[]) {
    range.deleteContents();
    this.handleSpaces(elements)
    for (const element of elements) {
      range.insertNode(element);
    }
  }

  insertDiv(line: HTMLElement, lastAlignDivId: string, lastBr: any) {
    const id = line['alignDivId'];
    const alignDiv = this.container.querySelector(`[id='${id}']`);
    if (alignDiv) {
      this.appentToAlignDiv(id, lastAlignDivId, line, alignDiv);
      return alignDiv
    }
    else {
      return this.recreateAlignDiv(line, lastBr);
    }
  }

  private appentToAlignDiv(id: any, lastAlignDivId: string, line: HTMLElement, alignDiv: Element) {
    if (id === lastAlignDivId) {
      for (const child of line['alignDivChildren'].reverse()) {
        alignDiv.insertBefore(child, alignDiv.firstChild);
      }
    }
    else {
      for (const child of line['alignDivChildren']) {
        alignDiv.append(child);
      }
    }
  }

  recreateAlignDiv(line: HTMLElement, lastBr: any) {
    const style = line['alignDivStyle'];
    const id = line['alignDivId'];
    const div = this.createAlignDiv(null, null, style, null, id);
    if (lastBr) {
      this.container.insertBefore(div, lastBr.nextSibling);
    }
    else {
      const startBr = this.getElementById('start-br');
      this.container.insertBefore(div, startBr.nextSibling);
    }
    const alignDiv = this.container.querySelector(`[id='${div.id}']`);
    for (const child of line['alignDivChildren']) {
      alignDiv.append(child);
    }
    return alignDiv
  }

  insertBr(lastAlignDiv: HTMLElement) {
    const newBr = this.createElement('br');
    this.container.insertBefore(newBr, lastAlignDiv.nextSibling)
    const lastBr = this.container.querySelector(`[id='${newBr.id}']`);
    return lastBr;
  }

  getAnchors(
    selectionInfo: SelectionInfo,
    partList: ChildNode[],
    href,
    target,
  ) {
    if (!(partList && partList.length && partList.length > 0)) return null;
    let elements: HTMLElement[] = [];
    const parentStyle = selectionInfo.parent ?.getAttribute('style');
    switch (selectionInfo.type) {
      case 'text':
      case 'div':
      case 'a':
        const a = this.createAnchor(partList[0].nodeValue, href, target, null, parentStyle);
        elements.push(a)
        break;
      case 'multiInOneLine':
        elements = [...this.getMultiAnchorsOneLine(partList, href, target)]
        break;
      case 'multiLines':
        elements = [...this.getMultiAnchors(partList, href, target)]
        break;
    }
    return elements
  }

  getMultiAnchorsOneLine(partList, href, target) {
    const elements = partList.map(part => {
      return this.getAnchorInOneLine(part, href, target)
    })
    return elements
  }

  getAnchorInOneLine(part: ChildNode, href, target) {
    let parentStyle;
    if (['DIV', 'A'].includes(part.nodeName)) {
      parentStyle = (part as HTMLElement).getAttribute('style');
    }
    const a = this.createAnchor(part.textContent, href, target, null, parentStyle);
    return a
  }

  getMultiAnchors(partList: ChildNode[], href, target) {
    let elements = [];
    for (const part of partList) {
      if (part.nodeName === 'BR') {
        elements.push({ type: 'br', });
        continue
      }
      const list = this.getAnchorList(part, href, target);
      const line = {
        type: 'line',
        alignDivId: part['id'],
        alignDivChildren: list,
        alignDivStyle: (part as HTMLElement).getAttribute('style')
      }
      elements.push(line);
    }
    return elements
  }

  getAnchorList(part: ChildNode, href, target): HTMLElement[] {
    const elementList = [];
    if (part.nodeName === 'DIV' || part.nodeName === 'A') {
      const childList = Array.from(part.childNodes);
      for (const child of childList) {
        const childElem = child as HTMLElement;
        const parentStyle = childElem.getAttribute('style');
        const a = this.createAnchor(child.textContent, href, target, null, parentStyle);
        elementList.push(a)
      }
    }
    else if (part.nodeName === 'BR') {
      const newElem = this.createElement('br');
      elementList.push(newElem)
    }
    return elementList
  }

  createAnchorFromParent(text, parent: HTMLElement, newStyle) {
    const attrList = [
      { name: 'href', value: parent['href'] },
      { name: 'target', value: parent['target'] }
    ];
    const parentStyle = parent.getAttribute('style');
    const a = this.createElement('a', text, parentStyle, newStyle, null, attrList);
    return a
  }

  createAnchor(text, href, target, parentStyle, newStyle) {
    const attrList = [
      { name: 'href', value: href },
      { name: 'target', value: target }
    ];
    const a = this.createElement('a', text, parentStyle, newStyle, null, attrList);
    return a
  }

  changeElements(elements, selectionInfo) {
    let newElements = [];
    if (selectionInfo.type === 'multiLines') {
      for (const line of elements) {
        if (line.type === 'line') {
          let newChildren = [];
          for (const child of line.alignDivChildren as HTMLElement[]) {
            if (child.nodeName === 'A') {
              const div = this.createElement('div', child.textContent, child.getAttribute('style'), 'pass');
              newChildren.push(div)
            }
            else {
              newChildren.push(child)
            }
          }
          const newLine = { ...line, alignDivChildren: newChildren };
          newElements.push(newLine)
        }
        else {
          newElements.push(line)
        }
      }
    }
    else {
      for (const child of elements) {
        if (child.nodeName === 'A') {
          const div = this.createElement('div', child.textContent, child.getAttribute('style'), 'pass');
          newElements.push(div)
        }
        else {
          newElements.push(child)
        }
      }
    }
    return newElements
  }

  createElement(
    name,
    text?,
    oldStyle?,
    newStyle?,
    id?,
    attributeList?: { name, value }[]
  ): HTMLElement {
    const tag = this.renderer.createElement(name);
    if (text) {
      (tag as HTMLElement).innerHTML = text
    }
    this.addId(tag, id);
    if (name !== 'br') {
      let stl = 'display: inline-block;width: fit-content;';
      this.addStyles(tag, stl);
    }
    if (oldStyle && newStyle) {
      this.addStyles(tag, oldStyle);
    }
    if (newStyle && newStyle !== 'pass') {
      this.addStyles(tag, newStyle)
    }
    if (attributeList) {
      this.addAttributes(tag, attributeList)
    }
    return tag;
  }

  addAttributes(tag, attributeList: { name, value }[]) {
    for (const attr of attributeList) {
      this.renderer.setAttribute(tag, attr.name, attr.value);
    }
  }

  addId(tag, id) {
    if (!id) {
      id = uuid();
    }
    this.renderer.setAttribute(tag, 'id', id);
  }

  private addStyles(tag: any, style: string) {
    if (!style) {
      return
    }
    const stlArr = style.split(';');
    const styleList: { name: string; value: string }[] = [];
    for (const stl of stlArr) {
      if (stl === '') continue;
      const arr = stl.split(':');
      if (arr.length && arr.length === 2) {
        styleList.push({ name: arr[0].trim(), value: arr[1].trim() })
      }
    }
    for (const stl of styleList) {
      this.renderer.setStyle(tag, stl.name, stl.value);
    }
  }

  handleSpaces(elements: HTMLElement[]) {
    let space;
    let i;
    for (const [index, element] of elements.entries()) {
      if (/^\s+$/.test(element.textContent)) {
        if (index === 0) {
          space = '&nbsp;' //element.textContent
        }
        else if (index > 0) {
          const text = elements[index - 1].textContent;
          elements[index - 1].innerHTML = text + '&nbsp;' //element.textContent
        }
        i = index
      }
      else {
        if (space) {
          const text = element.textContent;
          element.innerHTML = text + space;
          space = null
        }
      }
    }
    if (i) {
      elements.splice(i, 1)
    }
  }

  getElementById(id: string): HTMLElement {
    return this.container.querySelector(`[id='${id}']`)
  }
}
