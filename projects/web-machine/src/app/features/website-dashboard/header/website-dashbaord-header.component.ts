import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { AppState } from '@ws-store/index';
import { Store } from '@ngrx/store';
import { RoutingService } from '../../../core/services/routing.service';
import { PopupService, ResultsPopupComponent } from '@ws-sal';
import { UserService } from '../../../core/services/user.service';
import { currentUser } from '@ws-store/user/user.selectors';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ws-website-dashbaord-header',
  templateUrl: './website-dashbaord-header.component.html',
  styleUrls: ['./website-dashbaord-header.component.scss'],
})
export class WebsiteDashbaordHeaderComponent implements OnInit {
  @ViewChild('signUserTemplate') signUserTemplate: TemplateRef<any>;

  email$: Observable<string>;
  dialogRef: MatDialogRef<ResultsPopupComponent, any>;

  constructor(
    private popupSv: PopupService,
    private store: Store<AppState>,
    private routingSv: RoutingService,
    private userSv: UserService
  ) {}

  ngOnInit(): void {
    this.setEmail();
  }

  private setEmail() {
    this.email$ = this.store.select(currentUser).pipe(
      filter((user) => !!user),
      map((user) => user['email'])
    );
  }

  onLogout() {
    this.userSv.logout('home');
  }

  onPopupClick() {
    this.closeSignUserPopup();
  }

  closeSignUserPopup() {
    this.dialogRef.close();
  }

  openSignUserPopup() {
    const config = {
      minWidth: '300px',
      position: { top: '65px', right: '0' },
      backdropClass: 'backdrop',
    };
    this.dialogRef = this.popupSv.openPopup1(
      this.signUserTemplate,
      this.email$,
      config
    );
  }
}
