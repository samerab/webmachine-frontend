import { Observable, of, Subscription } from 'rxjs';
import { MenuService } from '../services/menu.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MenuData } from '../models';
import { switchMap } from 'rxjs/operators';
import { LanguageService } from '../../sal-translate/language.service';

@Component({
  selector: 'sam-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() menuData$: Observable<MenuData>;
  @Input() color: string;
  @Output() onItemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  sub: Subscription = new Subscription();


  lang: string;
  shownList$: Observable<MenuItem[]>;

  constructor(
    private menuSv: MenuService,
    private langSv: LanguageService,
  ) {
  }

  ngOnInit() {
    this.setShownList();
    this.subToLang();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  subToLang() {
    this.sub.add(
      this.langSv.currentLang.subscribe(lang => {
        this.lang = lang;
      })
    );
  }

  private setShownList() {
    this.shownList$ = this.menuData$.pipe(
      switchMap(menuData => {
        if (menuData?.list?.length > 0) {
          return of(this.menuSv.getFamilyTree(menuData.list, { rootToStartFrom: menuData.rootToStartFrom }));
        }
        return of(null);
      }));
  }

  onchildClicked(item: MenuItem) {
    this.onItemClick.emit(item);
  }

}
