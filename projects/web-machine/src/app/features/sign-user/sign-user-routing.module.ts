import { PlansComponent } from './plans/plans.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ConfirmEmailComponent } from './signup/confirm-email/confirm-email.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'plans',
    component: PlansComponent
  },
  {
    path: 'email/confirmation',
    children: [
      {
        path: '',
        component: ConfirmEmailComponent,
        data: { template: 'confirmMessage' }
      },
      {
        path: 'success',
        component: ConfirmEmailComponent,
        data: { template: 'success' }
      },
      {
        path: 'failure',
        component: ConfirmEmailComponent,
        data: { template: 'failure' }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUserRoutingModule { }
