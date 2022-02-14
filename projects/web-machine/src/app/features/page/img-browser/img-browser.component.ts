import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FilesBrowser, FILES_BROWSER, SalFile } from '@ws-sal';
import { getAllFiles } from '@ws-store/file/file.selectors';
import { AppState } from '@ws-store/index';

@Component({
  selector: 'ws-img-browser',
  templateUrl: './img-browser.component.html',
  styleUrls: ['./img-browser.component.scss'],
  providers: [
    {
      provide: FILES_BROWSER,
      useExisting: ImgBrowserComponent,
    },
  ],
})
export class ImgBrowserComponent implements OnInit, FilesBrowser {
  @Output() onCancel = new EventEmitter<null>();
  @Output() onSelect = new EventEmitter<SalFile[]>();
  fileList;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  get fileList$() {
    return this.store.pipe(select(getAllFiles));
  }

  _onCancel() {
    this.onCancel.emit();
  }

  _onSelect(fileList) {
    this.fileList = fileList;
  }

  select() {
    this.onSelect.emit(this.fileList);
  }
}
