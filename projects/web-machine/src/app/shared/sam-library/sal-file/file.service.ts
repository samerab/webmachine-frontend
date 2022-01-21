import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SalFile } from '@ws-sal';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  download(file: SalFile) {
    const a: HTMLAnchorElement = this.renderer.createElement('a');
    a.href = file.url;
    a.download = file.url;
    a.click();
  }
}
