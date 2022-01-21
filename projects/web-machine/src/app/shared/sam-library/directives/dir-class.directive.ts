import { Directive, Input, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LanguageService } from '../sal-translate/language.service';

@Directive({
  selector: '[rtlClass]'
})
export class DirClassDirective implements OnInit, OnDestroy {

  @Input() rtlClass: string;
  @Input() ltrClass: string;
  sub: Subscription = new Subscription();


  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private langSv: LanguageService,
  ) { }

  ngOnInit() {
    this.setClass();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setClass() {
    this.sub.add(this.langSv.currentLang.pipe(
      tap(lang => {
        if (lang === 'ar') {
          if (this.rtlClass) {
            this.renderer.addClass(this.el.nativeElement, this.rtlClass);
          }
          if (this.ltrClass) {
            this.renderer.removeClass(this.el.nativeElement, this.ltrClass)
          }
        }
        else {
          if (this.rtlClass) {
            this.renderer.removeClass(this.el.nativeElement, this.rtlClass);
          }
          if (this.ltrClass) {
            this.renderer.addClass(this.el.nativeElement, this.ltrClass);
          }
        }
      })
    ).subscribe())
  }

}
