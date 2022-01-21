import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Grid, MenuItem, Page, PopupService, ResultsPopupComponent, SalAction, SalActionName } from '@ws-sal';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sal-templates-gallery',
  templateUrl: './templates-gallery.component.html',
  styleUrls: ['./templates-gallery.component.scss']
})
export class TemplatesGalleryComponent implements OnInit, OnDestroy {

  @Input() templateList$: Observable<any>;

  @Output() onTemplateAction: EventEmitter<SalAction> = new EventEmitter<SalAction>();

  @ViewChild('changeNameTemplate') changeNameTemplate: TemplateRef<any>;

  pageList$: any[] = [];
  fixedGridList$: BehaviorSubject<Grid[]> = new BehaviorSubject<Grid[]>([]);
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  currentTemplate: Page;
  sub: Subscription = new Subscription();

  constructor(private popupSv: PopupService) { }

  ngOnInit(): void {
    this.subToTemplageList()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  subToTemplageList() {
    this.sub.add(
      this.templateList$
        .pipe(filter(templateList => !!templateList))
        .subscribe((templateList: { type: string, list: Page[] }) => {
          this.pageList$.splice(0);
          if (templateList.list?.length) {
            for (const template of templateList.list) {
              const page = {
                id: template.id,
                info: { ...template.info, type: templateList.type },
                content: template.content
              };
              this.pageList$.push(of(page))
            }
          }
        })
    )
  }

  onMenuItemClick(menuItem: MenuItem, page) {
    this.currentTemplate = page;
    switch (menuItem.id) {
      case 'edit':
        this.editTemplate()
        break;
      case 'delete':
        this.deleteTemplate()
        break;
    }
  }

  openPopup(name?) {
    const config = {
      width: '390px',
      height: '280px',
      position: { top: '200px' },
    }
    this.dialogRef = this.popupSv.openPopup1(this.changeNameTemplate, name, config);
  }

  onButtonSelect(data: { label: string, value: string }) {
    switch (data.label) {
      case 'save':
        this.updateTemplate(data.value)
        this.dialogRef.close()
        break;
      case 'cancel':
        this.dialogRef.close()
        break;
    }
  }

  getType() {
    return this.currentTemplate?.info?.type;
  }

  getId() {
    return this.currentTemplate?.id;
  }

  getUpdate(name) {
    let id, changes;
    if (this.currentTemplate.info.type === 'pageTemplate') {
      id = this.currentTemplate.id;
      const settings = {
        ...this.currentTemplate.content[0].settings,
        name
      }
      const firstGrid = { ...this.currentTemplate.content[0], settings };
      const copyContent = [...this.currentTemplate.content];
      copyContent[0] = { ...firstGrid };
      changes = {
        content: copyContent
      }
    }
    else {
      id = this.currentTemplate.content[0].id,
        changes = {
          settings: {
            ...this.currentTemplate.content[0].settings,
            name
          }
        }
    }
    const update = { id, changes };
    return update
  }

  editTemplate() {
    this.onTemplateAction.emit({
      entity: this.getType(),
      name: SalActionName.EDIT,
      payload: this.getId()
    })
  }

  updateTemplate(name) {
    const update = this.getUpdate(name);
    this.onTemplateAction.emit({
      entity: this.getType(),
      name: SalActionName.UPDATE_ONE,
      payload: update
    })
  }

  deleteTemplate() {
    this.onTemplateAction.emit({
      entity: this.getType(),
      name: SalActionName.DELETE_ONE,
      payload: this.getId()
    })
  }

  menu$ = of({
    list: [
      {
        id: 'options',
        icon: 'more_vert',
        parentId: 'root'
      },
      {
        id: 'edit',
        icon: 'edit',
        label: 'edit name',
        parentId: 'options'
      },
      {
        id: 'embed',
        icon: 'file_copy',
        label: 'embed',
        parentId: 'options'
      },
      {
        id: 'delete',
        icon: 'delete',
        label: 'delete',
        parentId: 'options'
      },
    ]
  })

}