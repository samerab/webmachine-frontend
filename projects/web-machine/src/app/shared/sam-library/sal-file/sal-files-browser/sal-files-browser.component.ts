import { FileService } from './../file.service';
import { ButtonConfig } from './../../sal-button/button/button.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  @Input() fileList$: Observable<SalFile[]>;
  @Output() onSelect: EventEmitter<SalFile[]> = new EventEmitter<SalFile[]>();
  @Output() onUpload: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() onDelete: EventEmitter<string[]> = new EventEmitter<string[]>();

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('imgZoom') imgZoomTemplate: TemplateRef<any>;
  @ViewChildren('file') files: QueryList<ElementRef<HTMLElement>>;

  showEmptyCircle = false;
  startList: NavbarItem[] = START_LIST;
  selectedFiles: SalFile[] = [];
  buttonsConfig: ButtonConfig = {
    buttonList: [
      { label: 'select', icon: 'input', color: 'primary' },
      { label: 'cancel', icon: 'clear' },
    ],
    height: '50px',
  };

  constructor(
    private popupSv: PopupService,
    private fileSv: FileService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  onHover(index: number) {
    const elem = this.files.get(index).nativeElement;
    if (!elem.classList.contains('active')) {
      this.renderer.addClass(elem, 'hover');
    } else {
      this.renderer.addClass(elem, 'show-zoom');
    }
  }

  onLeave(index: number) {
    const elem = this.files.get(index).nativeElement;
    this.renderer.removeClass(elem, 'hover');
    this.renderer.removeClass(elem, 'show-zoom');
  }

  onClickFile(index: number, file: SalFile) {
    const elem = this.files.get(index).nativeElement;
    if (elem.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
      this.removeFile(file);
      this.send(this.selectedFiles);
      this.handleEmptyCircle();
    } else {
      this.zoomImg(file);
    }
  }

  private zoomImg(file: SalFile) {
    const config = {
      width: 'auto',
      maxWidth: '95%',
      maxHeight: '100%',
    };
    this.popupSv.openPopup1(this.imgZoomTemplate, this.getSrc(file), config);
  }

  onClickCheck(index: number, file: SalFile) {
    const elem = this.files.get(index).nativeElement;
    if (elem.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
      this.renderer.addClass(elem, 'hover');
      this.removeFile(file);
    } else {
      this.renderer.removeClass(elem, 'hover');
      this.renderer.addClass(elem, 'active');
      this.addFile(file);
    }
    this.send(this.selectedFiles);
    this.handleEmptyCircle();
  }

  private handleEmptyCircle() {
    if (this.selectedFiles.length > 0) {
      this.showEmptyCircle = true;
    } else {
      this.showEmptyCircle = false;
    }
  }

  onZoom(file: SalFile) {
    this.zoomImg(file);
  }

  addFile(file: SalFile) {
    this.selectedFiles.push(file);
  }

  removeFile(file: SalFile) {
    const index = this.selectedFiles.findIndex((f) => f === file);
    this.selectedFiles.splice(index, 1);
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
