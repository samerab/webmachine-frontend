import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { getFixedGridById } from '@ws-store/fixed-grid/fixed-grid.selectors';
import { getGridTemplateById } from '@ws-store/grid-template/grid-template.selectors';
import { AppState } from '@ws-store/index';
import { getPageTemplateById } from '@ws-store/page-template/page-template.selectors';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ws-template-crud',
  templateUrl: './template-crud.component.html',
  styleUrls: ['./template-crud.component.scss']
})
export class TemplateCrudComponent implements OnInit {

  status;
  
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  get template$() {
    return this.route.paramMap
      .pipe(
        switchMap(params => {
          const templateType = params.get('type');
          const templateId = params.get('id');
          this.status = templateId ? 'edit' : 'add';
          if (this.status === 'edit') {
            return this.getTemplate(templateType, templateId)
          }
          return of(null);
        })
      )
  }

  private getTemplate(type: string, id: string) {
    switch (type) {
      case 'pageTemplate':
        return this.store.pipe(select(getPageTemplateById(id)));
      // case 'gridTemplate':
      //   return this.store.pipe(select(getGridTemplateById(id)));
      // case 'fixedGrid':
      //   return this.store.pipe(select(getFixedGridById(id)));
      default: return null
    }
  }

  save(template) {

  }

}
