import { delay } from 'rxjs/operators';
import { AppState } from '@ws-store/index';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { isLoading } from '@ws-store/common/common.selectors';
import { TranslateService } from '@ngx-translate/core';
import { AuxOutletComponent } from './aux-outlet/aux-outlet.component';
import { FontService } from '@ws-sal';
import { BootstrapService } from './core/services/bootstrap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('aux') aux: AuxOutletComponent;

  showAuxOutlet;
  loading$: Observable<boolean>;
  loading;

  constructor(
    private bootstrapSv: BootstrapService,
    private renderer: Renderer2,
    private router: Router,
    private store: Store<AppState>,
    private host: ElementRef,
    private translate: TranslateService,
    private fontSv: FontService
  ) {
    const domain = window.location.hostname;
    console.log('domain', domain);
    this.onRouterChange();
    this.bootstrapSv.bootstrap();
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'sam-theme-2');
    this.translate.setDefaultLang('ar');
  }

  ngAfterViewInit() {
    this.fontSv.addFontsToHead();
    this.loading$ = this.store.pipe(delay(0), select(isLoading));
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  onRouterChange() {
    this.router.events.subscribe((event): void => {
      if (event instanceof NavigationStart) {
        const outletConfig = this.getOutletConfig(event);
        if (outletConfig) {
          let auxClass = 'aux-outlet';
          this.showAuxOutlet = true;
          if (outletConfig.path.includes('fullscreen')) {
            auxClass = 'full-aux-outlet';
            this.aux.setFullscreen();
          }
          this.renderer.addClass(this.host.nativeElement, auxClass);
        } else {
          this.showAuxOutlet = false;
          this.renderer.removeClass(this.host.nativeElement, 'aux-outlet');
          this.renderer.removeClass(this.host.nativeElement, 'full-aux-outlet');
        }
      }
    });
  }

  getOutletConfig(navigationStart: NavigationStart) {
    const outletConfig = { outlet: null, path: null };
    const url = navigationStart.url;
    if (url.includes('(') && url.includes(')') && url.includes(':')) {
      const firstArrowIndex = url.indexOf('(');
      const lastArrowIndex = url.indexOf(')');
      const colonIndex = url.indexOf(':');
      outletConfig.outlet = navigationStart.url.substr(
        firstArrowIndex + 1,
        colonIndex - firstArrowIndex - 1
      );
      outletConfig.path = navigationStart.url.substr(
        colonIndex + 1,
        lastArrowIndex - colonIndex - 1
      );
      return outletConfig;
    }
    return null;
  }
}
