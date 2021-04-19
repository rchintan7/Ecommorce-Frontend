import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonAuthRoutingModule } from './non-auth-routing.module';
import { NonAuthComponent } from './non-auth.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    NonAuthComponent,
    LoginComponent,
    RegistrationComponent,
    VerifyAccountComponent,
    ForgotPasswordComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NonAuthRoutingModule,
  ]
})
export class NonAuthModule { }
