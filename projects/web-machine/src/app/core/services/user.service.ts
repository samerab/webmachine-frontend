import { filter, map, take, tap } from 'rxjs/operators';
import { AppState } from '@ws-store/index';
import { Injectable, InjectionToken, inject, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUser, loginUser, logoutUser } from '@ws-store/user/user.actions';
import { currentUser } from '@ws-store/user/user.selectors';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    public store: Store<AppState>,
    private routingSv: RoutingService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  refreshUser() {
    this.store
      .select(currentUser)
      .pipe(
        filter((user) => !user),
        take(1),
        tap(() => this.store.dispatch(loadUser({ id: 'refresh' })))
      )
      .subscribe();
  }

  login(user, navigateTo: string) {
    this.store.dispatch(loginUser({ user }));
    this.subToCurrentUser(navigateTo);
  }

  private subToCurrentUser(navigateTo: string) {
    this.store
      .select(currentUser)
      .pipe(
        filter((user) => !!user),
        take(1)
      )
      .subscribe((_) => this.routingSv.navigate(`${navigateTo}`));
  }

  logout(navigateTo: string) {
    this.store.dispatch(logoutUser());
    this.subToCurrentUser(navigateTo);
  }
}

export const LOGGED = new InjectionToken<Observable<boolean>>('LOOGED', {
  factory: () => {
    const userSv = inject(UserService);
    return userSv.store
      .select(currentUser)
      .pipe(map((user) => (user ? true : false)));
  },
});
