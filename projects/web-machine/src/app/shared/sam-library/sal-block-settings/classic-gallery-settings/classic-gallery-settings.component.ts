import { SettingsData } from './../../sal-page/page.model';
import { PageService } from './../../sal-page/services/page.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../../sal-popup';
import { ResultsPopupComponent } from '../../sal-popup/resultsPopup/resultsPopup.component';
import { BlockSettingsService } from '../block-settings.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SalFile } from '@ws-sal';
import { Observable } from 'rxjs';
import { EventService, SalEventName } from '../../sal-common/event.service';

@Component({
  selector: 'ws-classic-gallery-settings',
  templateUrl: './classic-gallery-settings.component.html',
  styleUrls: ['./classic-gallery-settings.component.scss']
})
export class ClassicGallerySettingsComponent implements OnInit {

  @ViewChild('template') template: TemplateRef<any>;
  form: FormGroup;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  fileList: Observable<SalFile[]>;

  constructor(
    private fb: FormBuilder,
    public settingsSv: BlockSettingsService,
    private popupSv: PopupService,
    private pageSv: PageService,
    private eventSv: EventService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.setForm();
    this.form.valueChanges.subscribe(val => {
      this.send(val);
    });
    this.setFileList();
  }

  buildForm() {
    this.form = this.fb.group({
      fileList: null,
      imagesPerCol: null,
      minWidth: null,
      gap: null,
      radius: null,
      rotate: null
    });
  }

  setForm() {
    this.settingsSv.savedBlockSettings$
      .subscribe((settingsData: SettingsData) => {
        this.form.setValue(settingsData.settings);
      });
  }

  send(val) {
    // to do: check validation
    this.settingsSv.send(val);
  }

  setFileList() {
    this.fileList = this.pageSv.fileListsubject$;
  }

  openFilesBrowser() {
    this.dialogRef = this.popupSv.openPopup1(this.template, this.fileList);
  }

  get fileListControl() {
    return this.form.get('fileList');
  }

  get srcList() {
    return this.form.get('fileList').value?.map(file => file.url);
  }

  addSelectedImages(list: SalFile[]) {
    if (!list) {
      return this.closPopup();
    }
    const files = [...list, ...this.fileListControl.value];
    this.fileListControl.setValue(files);
    this.closPopup();
  }

  closPopup() {
    this.dialogRef.close();
  }

  deleteImg(src: string) {
    const index = this.fileListControl.value.findIndex(file => src === file.url);
    const fileList = [...this.fileListControl.value];
    fileList.splice(index, 1);
    this.fileListControl.setValue(fileList);
  }

  onUpload(uploadedFiles: any[]) {
    this.eventSv.emit({name: SalEventName.UPLOAD_FILES, value: uploadedFiles});
  }

  onDelete(keys: string[]) {
    this.eventSv.emit({name: SalEventName.DELETE_FILES, value: keys});
  }

  drop(event: CdkDragDrop<string[]>) {
    const fileList = [...this.fileListControl.value];
    moveItemInArray(fileList, event.previousIndex, event.currentIndex);
    this.fileListControl.setValue(fileList);
  }

}
