import { AppState } from '@ws-store/index';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { User } from '@ws-store/user/user.model';
import { addUser } from '@ws-store/user/user.actions';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'ws-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  onSubmit(user: User) {
    const id = uuid();
    user = {...user, id};
    this.store.dispatch(addUser({user}))
  }

}
