import { Directive, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LanguageService } from '../sal-translate/language.service';

@Directive({
  selector: '[dirModifier]'
})
export class DirModifierDirective implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();


  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private langSv: LanguageService,
  ) { }

  ngOnInit() {
    this.setAttr();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setAttr() {
    this.sub.add(this.langSv.currentLang.pipe(
      tap(lang => {
        if (lang === 'ar') {
          this.renderer.setAttribute(this.el.nativeElement, 'dir', 'rtl');
        }
        else {
          this.renderer.setAttribute(this.el.nativeElement, 'dir', 'ltr');
        }
      })
    ).subscribe())
  }

}
