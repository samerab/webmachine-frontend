import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { ButtonConfig } from '../../sal-button/button/button.component';
import { PageService } from '../../sal-page';
import { StyleConfig, StyleData } from '../../sal-page/page.model';
import { PopupService } from '../../sal-popup/index';
import { STYLES } from '../styles';

@Component({
  selector: 'ws-style-builder',
  templateUrl: './style-builder.component.html',
  styleUrls: ['./style-builder.component.scss']
})
export class StyleBuilderComponent implements OnInit {

  @ViewChild('template') template: TemplateRef<any>;

  form: FormGroup;
  buttonConfig: ButtonConfig = {
    buttonList: [
      {label: 'add', icon: 'add', color: 'accent'},
      //{label: 'save', icon: 'dave', color: 'primary'},
    ],
    height: '50px'
  }
  
  constructor(
    private pageSv: PageService,
    private fb: FormBuilder,
    private popupSv: PopupService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.subToSavedStyle();
    this.onFormChange();
  }

  private subToSavedStyle() {
    this.pageSv.savedStyle$
      .pipe(
        filter(styleData => !!styleData && styleData.sender === 'consumer' && !!styleData.styleList),
        take(1)
      )
      .subscribe((styleData: StyleData) => {
        this.setSavedStyleList(styleData.styleList);
      });
  }

  buildForm() {
    this.form = this.fb.group({
      styles: this.fb.array([]),
    });
  }

  onFormChange() {
    this.form.valueChanges.subscribe(_ => {
      this.sendGeneratedStyle();
    });
  }

  // onFormChange() {
  //   this.form.valueChanges.subscribe(val => {
  //     const stylesArr = val.styles.map(styleConfig => styleConfig.style);
  //     let styleObj = {};
  //      for (const style of stylesArr) {
  //        styleObj = {...styleObj, ...style};
  //      }
  //     this.pageSv.setStyleSubject.next({sender: 'builder', css: styleObj});
  //   });
  // }

  get stylesControls() {
    return this.styleFormArray.controls;
  }

  get styleFormArray() {
    return this.form.get('styles') as FormArray;
  }

  addStyle(styleConfig: StyleConfig) {
    const formGroup = this.fb.group({ 
      id: styleConfig.id,
      value: null,  
    });
    this.styleFormArray.push(formGroup);
  }

  setSavedStyleList(styleList: StyleConfig[]) {
    for (const StyleConfig of styleList) {
      this.styleFormArray.push(this.fb.group(StyleConfig));
    }
  }

  dialog: MatDialogRef<any, any>;
  onClick(label) {
    switch (label) {
      case 'add':
        this.openStyleList();
        break;
        // case 'save':
        // this.sendGeneratedStyle();
        // break;
    }
  }

  private openStyleList() {
    this.dialog = this.popupSv.openPopup1(this.template, STYLES, {
      width: '400px',
      position: { top: '5%' },
    });
  }

  sendGeneratedStyle() {
      this.pageSv.setStyleSubject.next({sender: 'builder', styleList: this.form.value.styles});
  }

  onStyleSelect(styleConfig: StyleConfig) {
    this.addStyle(styleConfig)
    this.dialog.close();
  }

  deleteStyle(index: number) {
    this.styleFormArray.removeAt(index);
  }

  logObj() {
    console.log(this.form.value)
  }


}
