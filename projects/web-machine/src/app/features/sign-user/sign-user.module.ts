import { ValuesPipe } from './plans/values.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUserRoutingModule } from './sign-user-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SalUserModule, SalCommonModule } from '@ws-sal';
import { ConfirmEmailComponent } from './signup/confirm-email/confirm-email.component';
import { PlansComponent } from './plans/plans.component';
import { KeysPipe } from './plans/keys.pipe';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ConfirmEmailComponent,
    PlansComponent,
    KeysPipe,
    ValuesPipe
  ],
  imports: [
    CommonModule,
    SignUserRoutingModule,
    MatButtonModule,
    MatIconModule,
    SalUserModule,
    SalCommonModule,
  ]
})
export class SignUserModule { }
