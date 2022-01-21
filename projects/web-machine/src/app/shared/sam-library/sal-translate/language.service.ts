import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import * as settingActions from '@ws-store/setting/setting.actions';
import { getSetting } from '@ws-store/setting/setting.selectors';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslateObj } from './translate-obj';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
  ) { }

  setLang() {
    this.translate.addLangs(TranslateObj.availableLangs);
    this.currentLang
      .subscribe(currentLang => {
          this.translate.setDefaultLang(currentLang);
          // Re Code after set setting entity
      })
  }

  get currentLang(): Observable<string> {
    return this.store
      .pipe(
        select(getSetting('currentLang')),
        map(currentLangSetting => {
            return currentLangSetting?.value ? currentLangSetting.value : 'ar';
        })
      )
  }

  get availableLangs(): Observable<string[]> {
    return this.store
      .pipe(
        select(getSetting('availableLangs')),
        map(availableLangsSetting => {
            return availableLangsSetting?.value ? availableLangsSetting.value : null;
        })
      )
  }

  getTranslation(key: string): Observable<any> {
    return this.currentLang
      .pipe(
        switchMap(() => this.translate.get(key))
      )
  }

  /**
   * @param options 
   * example for options: 
   * {arOption: 'before', otherOption: 'after'} 
   * {arOption: 'end', otherOption: 'start'} 
   */
  getXposition(options: { arOption: string, otherOption: string }): Observable<string> {
    return this.currentLang
      .pipe(
        map(lang => {
          if (lang === 'ar') {
            return options.arOption
          }
          return options.otherOption
        })
      )
  }

  changeLang(lang: string) {
    this.translate.setDefaultLang(lang);
    this.store.dispatch(settingActions.updateSetting({
      setting: {
        id: 'currentLang',
        changes: { value: lang }
      }
    }))
  }

}