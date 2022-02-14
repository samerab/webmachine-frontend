import { ResultsPopupComponent } from './../../../../sal-popup/resultsPopup/resultsPopup.component';
import { ContentService } from './../../../services/content.service';
import { PageService } from './../../../services/page.service';
import { PopupService } from './../../../../sal-popup/popup-service/popup.service';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SalFile } from '@ws-sal';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { BlockService } from '../../../components/block/block.service';
import { getStyle } from '../../../../sal-style/styles';
import { OptionValue } from '../../../../sal-style/classes/option-value';

@Component({
  selector: 'app-gallery-editor',
  templateUrl: './gallery-editor.component.html',
  styleUrls: ['./gallery-editor.component.scss'],
})
export class GalleryEditorComponent implements OnInit, OnDestroy {
  @ViewChild('template') template: TemplateRef<any>;
  form: FormGroup;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  fileList: Observable<SalFile[]>;
  sub: Subscription = new Subscription();
  styles;

  constructor(
    private fb: FormBuilder,
    private popupSv: PopupService,
    private pageSv: PageService,
    private contenteSv: ContentService,
    private blockSv: BlockService
  ) {
    this.styles = {
      // imagesPerCol: new OptionValue('', ['auto-fit', 'auto-fill', 'value']),
      // minWidth: getStyle('min-width'),
      gap: getStyle('gap'),
      radius: getStyle('border-radius'),
      rotate: getStyle('rotate'),
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.setSavedSettings();
    this.sendChanges();
    this.setFileList();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      fileList: [],
      // imagesPerCol: null,
      // minWidth: null,
      gap: null,
      radius: null,
      rotate: null,
    });
  }

  private setSavedSettings() {
    this.sub.add(
      this.blockSv
        .fetchSettingsFromBlockTemplate()
        .pipe(filter((settings) => !!settings))
        .subscribe((settings) => {
          this.form.setValue(settings);
        })
    );
  }

  sendChanges() {
    this.sub.add(
      this.form.valueChanges.subscribe((val) => {
        this.setValues(val);
        const settings = this.genSettings(val);
        this.blockSv.sendSettingsFromBlockEditor(settings);
      })
    );
  }

  setValues(formVal) {
    for (const key in formVal) {
      if (this.styles.hasOwnProperty(key)) {
        this.styles[key].setValue(formVal[key]);
      }
    }
    console.log('formVal', formVal);
    console.log(this.styles);
  }

  genSettings(formVal) {
    return {
      fileList: formVal.fileList,
      gridStyleList: {
        gap: this.styles.gap,
      },
      imgStyleList: {
        radius: this.styles.radius,
        rotate: this.styles.rotate,
      },
    };
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
    this.onSelect();
  }

  onSelect() {
    this.sub.add(
      this.contenteSv.filesBrowser.onSelect
        .pipe(
          tap((x) => console.log('x', x)),
          filter((list) => !!list)
        )
        .subscribe((list: SalFile[]) => this.addSelectedImages(list))
    );
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
    let files = [...list];
    if (this.fileListControl?.value?.length > 0) {
      files = [...this.fileListControl.value];
    }
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
