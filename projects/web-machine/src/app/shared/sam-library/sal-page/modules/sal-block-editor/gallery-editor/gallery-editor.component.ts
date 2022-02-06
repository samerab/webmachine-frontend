import { ResultsPopupComponent } from './../../../../sal-popup/resultsPopup/resultsPopup.component';
import { ContentService } from './../../../services/content.service';
import { PageService } from './../../../services/page.service';
import { PopupService } from './../../../../sal-popup/popup-service/popup.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SalFile } from '@ws-sal';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BlockService } from '../../../components/block/block.service';

@Component({
  selector: 'app-gallery-editor',
  templateUrl: './gallery-editor.component.html',
  styleUrls: ['./gallery-editor.component.scss'],
})
export class GalleryEditorComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  form: FormGroup;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  fileList: Observable<SalFile[]>;

  constructor(
    private fb: FormBuilder,
    private popupSv: PopupService,
    private pageSv: PageService,
    private contenteSv: ContentService,
    private blockSv: BlockService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setSavedSettings();
    this.sendChanges();
    this.setFileList();
  }

  buildForm() {
    this.form = this.fb.group({
      fileList: null,
      imagesPerCol: null,
      minWidth: null,
      gap: null,
      radius: null,
      rotate: null,
    });
  }

  private setSavedSettings() {
    this.blockSv
      .fetchSettingsFromBlockTemplate()
      .pipe(filter((settings) => !!settings))
      .subscribe((settings) => {
        this.form.setValue(settings);
      });
  }

  sendChanges() {
    this.form.valueChanges.subscribe((val) => {
      this.blockSv.sendSettingsFromBlockEditor(val);
    });
  }

  setFileList() {
    this.fileList = this.pageSv.fileListsubject$;
  }

  openFilesBrowser() {
    this.dialogRef = this.popupSv.openPopup1(
      this.contenteSv.fileBrowsertemplate,
      this.fileList,
      {
        width: '95%',
        height: '80%',
      }
    );
    this.contenteSv.fileBrowser.onSelect
      .pipe(filter((list) => !!list))
      .subscribe((list: SalFile[]) => this.addSelectedImages(list));
  }

  get fileListControl() {
    return this.form.get('fileList');
  }

  get srcList() {
    return this.form.get('fileList').value?.map((file) => file.url);
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
    const index = this.fileListControl.value.findIndex(
      (file) => src === file.url
    );
    const fileList = [...this.fileListControl.value];
    fileList.splice(index, 1);
    this.fileListControl.setValue(fileList);
  }

  drop(event) {
    const fileList = [...this.fileListControl.value];
    moveItemInArray(fileList, event.previousIndex, event.currentIndex);
    this.fileListControl.setValue(fileList);
  }
}
