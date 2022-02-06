import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getAllFiles } from '@ws-store/file/file.selectors';
import { AppState } from '@ws-store/index';

@Component({
  selector: 'ws-img-browser',
  templateUrl: './img-browser.component.html',
  styleUrls: ['./img-browser.component.scss'],
})
export class ImgBrowserComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  get fileList$() {
    return this.store.pipe(select(getAllFiles));
  }
}
