import { RoutingService } from './../../core/services/routing.service';
import { AppState } from '@ws-store/index';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { PopupService, ResultsPopupComponent } from '@ws-sal';
import { MatDialogRef } from '@angular/material/dialog';
import { currentUser } from '@ws-store/user/user.selectors';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('signUserTemplate') signUserTemplate: TemplateRef<any>;

  dialogRef: MatDialogRef<ResultsPopupComponent, any>;
  email$: Observable<string>;
  menuList = [
    { title: 'Home', link: '/' },
    { title: 'Plans', link: '/users/plans' },
  ];

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

  closeSignUserPopup() {
    this.dialogRef.close();
  }

  onLogin() {
    this.routingSv.navigate('loginUser');
  }

  onSignup() {
    this.routingSv.navigate('signup');
  }
  onLogout() {
    this.userSv.logout('home');
  }

  onDash() {
    this.routingSv.navigate('usersDashboard');
  }

  onPopupClick() {
    this.closeSignUserPopup();
  }

  goHome() {
    this.routingSv.navigate('home');
  }
}
