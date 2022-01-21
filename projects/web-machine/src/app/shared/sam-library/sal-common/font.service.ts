import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GOOGLE_FONTS } from './google-fonts';

@Injectable({
  providedIn: 'root'
})
export class FontService {
  private renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getFonts() {
    return GOOGLE_FONTS2
  }

  addFontsToHead() {
    const fontsGroups = new Array(Math.ceil(GOOGLE_FONTS.length / 10))
      .fill('')
      .map(_ => GOOGLE_FONTS.splice(0, 10))
    for (const group of fontsGroups) {
      this.addLinkTag(group)
    }

  }

  private addLinkTag(fontGroup: string[]) {
    let fonts = '';
    for (const font of fontGroup) {
      fonts += font + '|';
    }
    fonts = fonts.slice(0, -1);
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const link: HTMLLinkElement = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${fonts}`;
    this.renderer.appendChild(head, link);
  }

}

export const GOOGLE_FONTS2 = [
  "Roboto",
  "Merriweather",
  "Meow Script",
  "Luxurious Script",
  "Bebas Neue",
  "Lobster",
  "Anton",
  "Tangerine",
  "Monoton"
];
