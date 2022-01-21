import { RoutingService } from './../../../core/services/routing.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'ws-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private userSv: UserService, private routingSv: RoutingService) {}

  ngOnInit(): void {}

  onSubmit(user) {
    this.userSv.login(user, 'usersDashboard');
  }

  onSignup() {
    this.routingSv.navigate('signup');
  }
}
