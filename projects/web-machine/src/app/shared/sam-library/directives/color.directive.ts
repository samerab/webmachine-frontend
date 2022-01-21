import { Directive, Renderer2, OnInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[salColor]'
})
export class ColorDirective implements OnInit {

  @Input('salColor') salColor: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.element.nativeElement, this.salColor);
  }

}
