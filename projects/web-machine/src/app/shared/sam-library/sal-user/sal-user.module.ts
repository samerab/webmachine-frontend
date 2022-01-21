import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalLoginComponent } from './sal-login/sal-login.component';
import { SalSignupComponent } from './sal-signup/sal-signup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SalLoginComponent,
    SalSignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [
    SalLoginComponent,
    SalSignupComponent
  ]
})
export class SalUserModule { }
