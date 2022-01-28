import { FileService } from './../file.service';
import { ButtonConfig } from './../../sal-button/button/button.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ClickedNavbarItem, NavbarItem } from '../../sal-menu/models';
import { START_LIST } from './sal-files-browser.data';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { PopupService } from '../../sal-popup';
import { SalFile } from '@ws-sal';

@Component({
  selector: 'sal-files-browser',
  templateUrl: './sal-files-browser.component.html',
  styleUrls: ['./sal-files-browser.component.scss'],
})
export class SalFilesBrowserComponent implements OnInit {
  @Input() fileList: Observable<SalFile[]>;
  @Output() onSelect: EventEmitter<SalFile[]> = new EventEmitter<SalFile[]>();
  @Output() onUpload: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() onDelete: EventEmitter<string[]> = new EventEmitter<string[]>();

  @ViewChild('fileInput') fileInput: ElementRef;

  startList: NavbarItem[] = START_LIST;
  selectedFiles: SalFile[] = [];
  buttonsConfig: ButtonConfig = {
    buttonList: [
      { label: 'select', icon: 'input', color: 'primary' },
      { label: 'cancel', icon: 'clear' },
    ],
    height: '50px',
  };

  constructor(private popupSv: PopupService, private fileSv: FileService) {}

  ngOnInit(): void {}

  addFile(file: SalFile, e: MatCheckboxChange) {
    if (e.checked) {
      this.selectedFiles.push(file);
    } else {
      const index = this.selectedFiles.findIndex((f) => f === file);
      this.selectedFiles.splice(index, 1);
    }
    this.send(this.selectedFiles);
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  fileChange(element) {
    const uploadedFiles = element.target.files;
    this.onUpload.emit(uploadedFiles);
  }

  // onClick(label) {
  //   switch (label) {
  //     case 'select':
  //       this.send(this.selectedFiles);
  //       break;
  //     case 'cancel':
  //       this.send();
  //       break;
  //   }
  // }

  send(payload?: SalFile[]) {
    this.onSelect.emit(payload);
  }

  runCommand(clickedNavbarItem: ClickedNavbarItem) {
    switch (clickedNavbarItem.id) {
      case 'delete':
        this.deleteFile();
        break;
      case 'upload':
        this.triggerUpload();
        break;
      case 'download':
        this.download();
        break;
    }
  }

  deleteFile() {
    if (!this.selectedFiles.length) {
      return this.popupSv.showErrMsg('select file to delete');
    }
    this.popupSv
      .showDialog('message.warning_delete')
      .pipe(
        take(1),
        filter((res) => !!res)
      )
      .subscribe((_) => {
        this.onDelete.emit(this.selectedFiles.map((file) => file.id));
      });
  }

  getSrc(file: SalFile) {
    if (this.isImg(file.ext)) return file.url;
    if (this.isPdf(file.ext)) return 'assets/common/pdf-icon.svg';
    return 'assets/common/file-icon.svg';
  }

  isImg(ext: string) {
    return ['png', 'jpg', 'jpeg'].includes(ext);
  }

  isPdf(ext: string) {
    return ext === 'pdf';
  }

  download() {
    for (const file of this.selectedFiles) {
      this.fileSv.download(file);
    }
  }
}
