import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

interface StyleData {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class StyleInfoService {

  private renderer: Renderer2;
  modifyElements;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setInfo(fontSizeControl: FormControl, select: MatSelect) {
    this.resetModifyElements(fontSizeControl, select);
    const range = window.getSelection().getRangeAt(0).cloneRange();
    const container = range.commonAncestorContainer;
    let parent;
    if (container.nodeName === 'DIV') {
      if (container['id'] === 'content') {
        return;
      }
      if (container['id'].startsWith('align')) {
        const alignStyle = this.getAlignInfo(container as HTMLElement);
        if (alignStyle) {
          this.renderer.addClass(this.modifyElements[alignStyle], 'active-style');
        }
        return;
      }
      parent = container
    }
    if (container.nodeName === '#text') {
      parent = container.parentElement;
    }
    if (parent) {
      this.handleParent(parent, fontSizeControl, select)
    }
  }

  handleParent(parent, fontSizeControl: FormControl, select: MatSelect) {
    const style = parent.getAttribute('style');
    if (!style) return;
    const fullStyleList = this.transformStyle(style);
    const styleList = fullStyleList.filter(style => !['display', 'width'].includes(style.name));
    const activeStyles = this.getActiveStyles(styleList);
    const alignStyle = this.getAlignInfo(parent);
    if (alignStyle) {
      activeStyles.push(alignStyle)
    }
    for (const [index, style] of activeStyles.entries()) {
      if (this.handleFontFamily(select, style, styleList, index)) continue;
      if (this.handleFontSize(fontSizeControl, style, styleList, index)) continue;
      if (this.handleColorStyle(style, styleList, index)) continue;
      if (this.handleBgColorStyle(style, styleList, index)) continue;
      this.renderer.addClass(this.modifyElements[style], 'active-style');
    }
  }

  setModifyElements() {
    const bold = document.getElementById('bold');
    const italic = document.getElementById('italic');
    const underline = document.getElementById('underline');
    const left = document.getElementById('left');
    const center = document.getElementById('center');
    const right = document.getElementById('right');
    this.modifyElements = {
      bold,
      italic,
      underline,
      left,
      center,
      right,
    }
  }

  resetModifyElements(fontSizeControl: FormControl, select: MatSelect) {
    this.resetMainModifyElements()
    this.resetColorButton();
    this.resetBgColorButton();
    this.resetFontSize(fontSizeControl);
    this.resetFontFamily(select)
  }

  resetMainModifyElements() {
    for (const [key, value] of Object.entries(this.modifyElements)) {
      this.renderer.removeClass(value, 'active-style');
    }
  }

  private resetColorButton() {
    const color = document.getElementById('color');
    this.renderer.setStyle(color, 'color', '#000000');
  }

  private resetBgColorButton() {
    const bgColor = document.getElementById('bgColor');
    this.renderer.setStyle(bgColor, 'color', '#000000');
  }

  private resetFontSize(fontSizeControl: FormControl) {
    fontSizeControl.setValue('14', { emitEvent: false })
  }

  private resetFontFamily(select: MatSelect) {
    select.value = 'Roboto'
  }


  private handleFontSize(fontSizeControl: FormControl, style: string, styleList: StyleData[], index) {
    if (style === 'fontSize') {
      const val = styleList[index].value.slice(0, -2);
      fontSizeControl.setValue(val, { emitEvent: false })
      return true
    }
    return false
  }

  private handleFontFamily(select: MatSelect, style: string, styleList: StyleData[], index) {
    if (style === 'fontFamily') {
      const val = styleList[index].value;
      select.value = val;
      return true
    }
    return false
  }

  private handleColorStyle(style: string, styleList: StyleData[], index) {
    if (style === 'color') {
      const color = document.getElementById('color');
      const val = styleList[index].value;
      this.renderer.setStyle(color, 'color', val);
      return true
    }
    return false
  }

  private handleBgColorStyle(style: string, styleList: StyleData[], index) {
    if (style === 'bgColor') {
      const bgColor = document.getElementById('bgColor');
      const val = styleList[index].value;
      this.renderer.setStyle(bgColor, 'color', val);
      return true
    }
    return false
  }

  getAlignInfo(base: HTMLElement) {
    let alignDiv;
    if (base.id.startsWith('align')) {
      alignDiv = base
    }
    else {
      alignDiv = base.parentElement
    }
    if (alignDiv) {
      return this.extractStyle(alignDiv, 'text-align')
    }
    return null
  }

  extractStyle(element: HTMLElement, styleName) {
    const fullStyle = element.getAttribute('style');
    if (!fullStyle) return null;
    const styleList = this.transformStyle(fullStyle);
    const style = styleList.find(style => style.name === styleName);
    if (!style) return null;
    return style.value;
  }

  extractStyleFromFirstChild(alignDiv: HTMLElement) {
    const firstChild = alignDiv.firstChild;
    if (firstChild && firstChild.nodeName === 'DIV') {
      const style = (firstChild as HTMLElement).getAttribute('style');
      return style;
    }
    return null
  }

  private transformStyle(style: string) {
    const stlArr = style.split(';');
    const styleList: { name: string; value: string }[] = [];
    for (const stl of stlArr) {
      if (stl === '') continue;
      const arr = stl.split(':');
      styleList.push({ name: arr[0].trim(), value: arr[1].trim() })
    }
    return styleList
  }

  getActiveStyles(styleList: StyleData[]) {
    const activeStyles = [];
    for (const style of styleList) {
      switch (style.name) {
        case 'font-weight':
          activeStyles.push('bold')
          break;
        case 'font-style':
          activeStyles.push('italic')
          break;
        case 'text-decoration':
          activeStyles.push('underline')
          break;
        case 'color':
          activeStyles.push('color')
          break;
        case 'background-color':
          activeStyles.push('bgColor')
          break;
        case 'font-size':
          activeStyles.push('fontSize')
          break;
        case 'font-family':
          activeStyles.push('fontFamily')
          break;
        default:
          break;
      }
    }
    return activeStyles
  }


}
