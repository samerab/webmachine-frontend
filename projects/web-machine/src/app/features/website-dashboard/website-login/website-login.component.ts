import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-website-login',
  templateUrl: './website-login.component.html',
  styleUrls: ['./website-login.component.scss'],
})
export class WebsiteLoginComponent implements OnInit {
  constructor(private userSv: UserService) {}

  ngOnInit(): void {}

  onSubmit(user) {
    this.userSv.login(user, 'websiteDashboard');
  }
}
