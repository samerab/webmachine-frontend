import { LocalStoreService } from './../lacal-store-service/local-store.service';
import { SnackMessageComponent } from './../snack-message/snack-message.component';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultsPopupComponent } from '../resultsPopup/resultsPopup.component';
import { FullPage } from '../models';
import { MessageComponent } from '../message/message.component';

export interface MessageOptions {
  message: string;
  type?: MessageType;
  isFull?: boolean;
  isDialog?: boolean;
  buttonOkText?: string;
  buttonCancelText?: string;
}

export enum MessageType {
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
}

export enum MessageLayout {
  Full = 'full',
  Dialog = 'dialog',
}

const dialog = {
  width: '500px',
  position: { top: '100px' },
}



@Injectable()
export class PopupService {
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: LocalStoreService
  ) { }

  closeAll() {
    this.dialog.closeAll();
  }

  openPopup(template: TemplateRef<any>, data?, config?: MatDialogConfig) {
    const layout = config ? config : FullPage;
      const dialogRef = this.dialog.open(ResultsPopupComponent, {
      ...layout,
      data: {
        template,
        context: { data }
      }
    });
    return dialogRef.afterClosed().pipe(take(1));
  }

  /**
   * We use when need to use dialogRef als separate object in another method.
   * 1. dialogRef: MatDialogRef<ResultsPopupComponent, any>;
   * 2. openFilesBrowser() {
   *      this.dialogRef = this.popupSv.openPopup1(.......);
   *    }
   * 3. closPopup() {
   *     this.dialogRef.close();
   *    }
   */
  openPopup1(template: TemplateRef<any>, data?, config?: MatDialogConfig): MatDialogRef<ResultsPopupComponent, any> {
    const layout = config
      ? config
      : FullPage;
      const dialogRef = this.dialog.open(ResultsPopupComponent, {
      ...layout,
      data: {
        template,
        context: { data }
      }
    });
    return dialogRef;
  }

  /**
   * @MessageOptions 
   * {
   *  message: string;
   *  type?: MessageType;
   *  isFull?: boolean;
   *  isDialog?: boolean;
   *  buttonOkText?: string;
   *  buttonCancelText?: string;
   * }
   */
  showMsg(options: MessageOptions) {
    const defaultOptions = {
      type: MessageType.Error,
      isFull: false,
      isDialog: false,
      buttonOkText: 'button.ok',
      buttonCancelText: 'button.cancel'
    }
    const apliedOptions = { ...defaultOptions, ...options };
    const info = apliedOptions.isFull ? { ...FullPage, data: apliedOptions } : { ...dialog, data: apliedOptions };
    const dialogRef = this.dialog.open(MessageComponent, info);
    if (apliedOptions.isDialog) {
      return dialogRef.afterClosed().pipe(take(1));
    }
    return of(null)
  }

  showSuccessMsg(message = 'successful operation') {
    this.showMsg({
      message,
      type: MessageType.Success
    })
  }

  showErrMsg(message: string) {
    this.showMsg({
      message,
      type: MessageType.Error
    })
  }

  showDialog(message: string) {
    return this.showMsg({
      message,
      type: MessageType.Warning,
      isDialog: true,
      buttonOkText: 'button.yes',
      buttonCancelText: 'button.no'
    })
  }

  // showDeleteDialog(func) {
  //   this.showDialog('message.warning_delete')
  //     .pipe(
  //       take(1),
  //       filter(res => !!res)
  //     ).subscribe(func);
  // }
  showDeleteDialog() {
    return this.showDialog('message.warning_delete')
      .pipe(
        take(1),
        filter(res => !!res)
      ).toPromise();
  }

  /**
   * @options 
   *  {
   *  duration number ;
   *  horizontalPosition start | center | end;
   *  verticalPosition bottom | top; ||
   *  }
   */
  openSnackBar(message: string, options?) {
    //this.store.dispatch(setSnackBarMsg({ message }))
    this.store.snackMsgSubject.next(message);
    this.snackBar.openFromComponent(SnackMessageComponent , {
      duration: options?.duration ? options.duration : 1500,
      horizontalPosition: options?.horizontalPosition ? options.horizontalPosition : 'center',
      verticalPosition: options?.verticalPosition ? options.verticalPosition : 'bottom',
      panelClass: 'snack-bar'
    });
  }

}
